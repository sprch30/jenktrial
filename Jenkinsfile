pipeline {
    agent any 

    // This block tells Jenkins to automatically configure the NodeJS 26 tool you just added
    tools {
        nodejs 'NodeJS'
    }

    parameters {
        choice(name: 'ENV', choices: ['stage', 'prod'], description: 'Select target automation profile for execution')
    }

    stages {
        stage('Pull Code Sources') {
            steps {
                checkout scm
            }
        }

        stage('Build System Environment') {
            steps {
                echo "Restoring Node package binaries..."
                bat 'npm ci'
                echo "Installing Playwright Chrome automated browser binary engines..."
                bat 'npx playwright install chromium'
            }
        }

        stage('Automation Execution Suite') {
            steps {
                echo "Triggering test automation suite running on target environment profile: ${params.ENV}"
                bat "npx cross-env ENV=${params.ENV} playwright test"
            }
        }
    }

    post {
        always {
            echo "Archiving execution run artifacts for QA review..."
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
