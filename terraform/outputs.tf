output "lambda_function_arn" {
  description = "ARN of the Lambda function"
  value       = aws_lambda_function.payment_service.arn
}

output "api_gateway_invoke_url" {
  description = "Invoke URL for the API Gateway"
  value       = "${aws_api_gateway_deployment.deployment.invoke_url}/payment"
}
