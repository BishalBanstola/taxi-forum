provider "aws" {
  region = "ca-central-1"
}

# IAM Role for Payment Lambda
resource "aws_iam_role" "payment_lambda_role" {
  name = "payment_lambda_execution_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Effect = "Allow",
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

# IAM Policy for Payment Lambda
resource "aws_iam_policy" "payment_lambda_policy" {
  name        = "payment_lambda_policy"
  description = "IAM policy for the payment processing Lambda function"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = [
          "logs:*",
          "s3:*",
          "dynamodb:*" 
        ],
        Effect   = "Allow",
        Resource = "*"
      }
    ]
  })
}

# Attach IAM Policy to Payment Lambda Role
resource "aws_iam_role_policy_attachment" "payment_lambda_policy_attachment" {
  policy_arn = aws_iam_policy.payment_lambda_policy.arn
  role       = aws_iam_role.payment_lambda_role.name
}

# Payment Processing Lambda Function
resource "aws_lambda_function" "payment_processing_service" {
  function_name = "PaymentProcessingService"

  s3_bucket        = aws_s3_bucket.payment_lambda_code_bucket.bucket
  s3_key           = aws_s3_object.payment_lambda_code.key
  handler          = "index.handler"
  runtime          = "nodejs18.x"
  role             = aws_iam_role.payment_lambda_role.arn
  source_code_hash = filebase64sha256("lambda.zip")

  environment {
    variables = {
      PAYPAL_ACCESS_TOKEN = var.paypal_access_token
    }
  }
}

# S3 Bucket for Payment Lambda Code
resource "aws_s3_bucket" "payment_lambda_code_bucket" {
  bucket = "payment-lambda-code-bucket"
}

# Upload Payment Lambda Code to S3
resource "aws_s3_object" "payment_lambda_code" {
  bucket = aws_s3_bucket.payment_lambda_code_bucket.bucket
  key    = "lambda.zip"
  source = "lambda.zip"
  etag   = filemd5("lambda.zip")
}

# API Gateway for Payment Processing Service
resource "aws_api_gateway_rest_api" "payment_api" {
  name        = "PaymentProcessingAPI"
  description = "API Gateway for Payment Processing Service"
}

# Resource for Payment Endpoint
resource "aws_api_gateway_resource" "payment_resource" {
  rest_api_id = aws_api_gateway_rest_api.payment_api.id
  parent_id   = aws_api_gateway_rest_api.payment_api.root_resource_id
  path_part   = "payment"
}

# POST Method for Payment Resource
resource "aws_api_gateway_method" "post_payment_method" {
  rest_api_id   = aws_api_gateway_rest_api.payment_api.id
  resource_id   = aws_api_gateway_resource.payment_resource.id
  http_method   = "POST"
  authorization = "NONE"
}

# Integration between API Gateway and Payment Lambda
resource "aws_api_gateway_integration" "payment_lambda_integration" {
  rest_api_id             = aws_api_gateway_rest_api.payment_api.id
  resource_id             = aws_api_gateway_resource.payment_resource.id
  http_method             = aws_api_gateway_method.post_payment_method.http_method
  type                    = "AWS_PROXY"
  integration_http_method = "POST"
  uri                     = "arn:aws:apigateway:${data.aws_region.current.name}:lambda:path/2015-03-31/functions/${aws_lambda_function.payment_processing_service.arn}/invocations"
}

# Lambda Permission for API Gateway
resource "aws_lambda_permission" "payment_api_gateway_permission" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.payment_processing_service.function_name
  principal     = "apigateway.amazonaws.com"
  statement_id  = "AllowExecutionFromAPIGateway"
  source_arn    = "${aws_api_gateway_rest_api.payment_api.execution_arn}/*/*"
}

# Deploy API Gateway for Payment Processing Service
resource "aws_api_gateway_deployment" "payment_api_deployment" {
  depends_on = [
    aws_api_gateway_integration.payment_lambda_integration
  ]
  rest_api_id = aws_api_gateway_rest_api.payment_api.id
  stage_name  = "prod"
}
