pipeline {
    agent any 

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

        stage('Automation Execution Suite') {
            steps {
                echo "Triggering test automation suite running on target environment profile: ${params.ENV}"
                
                // Securely read your 'qa-login-pass' secret from Jenkins UI without warnings
                withCredentials([string(credentialsId: 'qa-login-pass', variable: 'SECURE_PASSWORD')]) {
                    script {
                        // EXPLICIT URL: https://herokuapp.com
                        def targetUrl = 'https://the-internet.herokuapp.com'
                        def targetUser = 'tomsmith'
                        
                        // Pass the variables cleanly into your cross-env string
                        bat "npx cross-env ENV=${params.ENV} URL=${targetUrl} USER=${targetUser} PASS=${env.SECURE_PASSWORD} npx playwright test --project=chromium"
                    }
                }
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
                reportName: 'Playwright Run Report'
            ])
        }

        // FAILURE EMAIL NOTIFICATION BLOCK
        failure {
            echo "Test suite failed! Sending automated failure alert email..."
            emailext (
                subject: "🚨 ALERT: Playwright Automation Failure - Build #${env.BUILD_NUMBER}",
                body: """<h3>Playwright Test Suite Regression Failure Alert</h3>
                         <p><b>Target Environment:</b> ${params.ENV}</p>
                         <p><b>Build Status:</b> ${currentBuild.currentResult}</p>
                         <p>Review console logs here: ${env.BUILD_URL}console</p>""",
                to: 'sprch.10@gmail.com',
                attachmentsPattern: 'playwright-report/**/*.*'
            )
        }
    }
}
