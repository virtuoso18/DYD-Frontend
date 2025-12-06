pipeline {
    agent any
    options {
        skipStagesAfterUnstable()
        disableRestartFromStage()
    }
    tools {
        nodejs "nodejs"
    }
    stages {
        stage('install') {
            when {
                branch 'main'
            }
            environment {
                
            }
            steps {
                echo "Creating Environment variables: ${env.BRANCH_NAME}"
                sh '''
				        rm -f .env
                    
                    
                    npm i --force
                '''
            }
        }

        stage('dev-main') {
            when {
                branch 'main'
            }
            steps {
                echo 'Deploying the software'
                sh 'npm run build'
            }
        }
    }
}
