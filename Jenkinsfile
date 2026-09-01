pipeline {
    agent any 

    parameters {
        choice(name: 'ENV', choices: ['stage', 'prod'], description: 'Select target automation profile for execution')
    }

    stages {
        stage('Pull Code Sources') {
            steps {
                checkout scm
            }
        }

        stage('Automation Execution Suite') {
            steps {
                echo "Triggering test automation suite running on target environment profile: ${params.ENV}"
                // Adding the --headed flag or running directly ensures it leverages local system assets without asking questions
                bat "npx cross-env ENV=${params.ENV} npx playwright test --project=chromium"
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
