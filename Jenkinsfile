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
                
                // We inject the URL and credentials directly here using conditions based on user selection
                script {
                    def targetUrl = (params.ENV == 'stage') ? 'https://herokuapp.com' : 'https://herokuapp.com'
                    def targetUser = 'tomsmith'
                    def targetPass = 'SuperSecretPassword!'
                    
                    bat "npx cross-env ENV=${params.ENV} URL=${targetUrl} USER=${targetUser} PASS=${targetPass} npx playwright test --project=chromium"
                }
            }
        }
    }
}
