pipeline {
    // 1. Tell Jenkins to run this directly on your local machine node agent
    agent any 

    // 2. Configure the dropdown menu in the Jenkins UI
    parameters {
        choice(name: 'ENV', choices: ['stage', 'prod'], description: 'Select target automation profile for execution')
    }

    stages {
        stage('Pull Code Sources') {
            steps {
                // Extracts the latest code changes pushed to your GitHub Repository
                checkout scm
            }
        }

        stage('Build System Environment') {
            steps {
                echo "Restoring Node package binaries..."
                // Use 'bat' because your local Jenkins is running on Windows
                bat 'npm ci'
                echo "Installing Playwright Chrome automated browser binary engines..."
                bat 'npx playwright install chromium'
            }
        }

        stage('Automation Execution Suite') {
            steps {
                echo "Triggering test automation suite running on target environment profile: ${params.ENV}"
                // Executes your script using your customized cross-env runtime variable
                bat "npx cross-env ENV=${params.ENV} playwright test"
            }
        }
    }

    // 3. Keep report tracking active even if assertions fail
    post {
        always {
            echo "Archiving execution run artifacts for QA review..."
            // Displays your local run reports inside the Jenkins sidebar window panel
            publishHTML(target: [
                allowMissing: false,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright Run HTML Report'
            ])
        }
    }
}
