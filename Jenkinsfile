pipeline {
    agent any 

    tools {
        nodejs 'NodeJS'
    }

    parameters {
        choice(name: 'ENV', choices: ['stage', 'prod'], description: 'Select target automation profile for execution')
    }

    environment {
        // 1. SECURE CREDENTIAL HANDLING
        // This dynamically pulls the secret text 'qa-login-pass' you just saved in the UI
        SECURE_PASS = credentials('qa-login-pass')
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
                script {
                    def targetUrl = 'https://herokuapp.com'
                    def targetUser = 'tomsmith'
                    
                    // Injected secure variables are completely masked as '****' in the execution logs!
                    bat "npx cross-env ENV=${params.ENV} URL=${targetUrl} USER=${targetUser} PASS=${SECURE_PASS} npx playwright test --project=chromium"
                }
            }
        }
    }

    post {
        always {
            echo "2. VIEWING REPORTS: Archiving Playwright report directly inside Jenkins UI..."
            // This displays your HTML index.html results page directly on the Jenkins sidebar
            publishHTML(target: [
                allowMissing: false,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright Run Report'
            ])
        }
        
        // 3. AUTOMATIC EMAIL NOTIFICATION ONLY ON FAILURE
        failure {
            echo "Automation suite failed! Dispatched automated failure alert with report attachments..."
            emailext (
                subject: "🚨 ALERT: Playwright Test Automation Failure - Build #${env.BUILD_NUMBER}",
                body: """<h3>Playwright Test Suite Regression Failure Alert</h3>
                         <p><b>Target Environment:</b> ${params.ENV}</p>
                         <p><b>Build Status:</b> ${currentBuild.currentResult}</p>
                         <p>Review full console stack traces here: ${env.BUILD_URL}console</p>""",
                to: 'shikha.qa@yourcompany.com',
                attachmentsPattern: 'playwright-report/**/*.*'
            )
        }
    }
}
