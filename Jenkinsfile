pipeline {
    agent {
        label 'docker_builder && dedicated_cpu'
    }
    environment {
        IMAGES_BASE     = "golang:1.12-alpine3.10 alpine:3.10"
        IMAGE_BARE      = "$DOCKER_REGISTRY/gitea"
        IMAGE_BRANCH    = "$IMAGE_BARE:$BRANCH_NAME"
        IMAGE           = "$IMAGE_BRANCH-$BUILD_NUMBER"
    }
    options {
        timestamps()
    }
    stages {
        stage('Pull Base Images') {
            steps {
                sh 'echo $IMAGES_BASE | xargs --max-args=1 docker pull'
            }
        }
        stage('Build Docker Image') {
            steps {
                sh '''
                    GITEA_VERSION=$(\
                        git describe --tags --always \
                        | sed 's/-/+/' \
                        | sed 's/^v//' \
                    )
                    docker build \
                        --tag $IMAGE-build-env \
                        --target build-env \
                        --build-arg GITEA_VERSION=$GITEA_VERSION \
                        .
                    docker build \
                        --tag $IMAGE \
                        --build-arg GITEA_VERSION=$GITEA_VERSION \
                        .
                '''
            }
            post {
                cleanup {
                    sh '''docker rmi \
                        $IMAGE-build-env \
                        --force
                    '''
                }
            }
        }
        stage('Push Docker Image') {
            steps {
                sh 'docker push $IMAGE'
                sh 'docker tag $IMAGE $IMAGE_BRANCH'
                sh 'docker push $IMAGE_BRANCH'
            }
            post {
                cleanup {
                    sh '''docker rmi \
                        $IMAGE_BRANCH \
                        --force
                    '''
                }
            }
        }
    }
    post {
        cleanup {
            sh '''docker rmi \
                $IMAGE \
                $IMAGES_BASE \
                --force
            '''
        }
    }
}
