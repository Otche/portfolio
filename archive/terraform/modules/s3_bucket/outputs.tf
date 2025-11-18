# outputs.tf du module s3_bucket

output "bucket_id" {
  description = "L'ID (nom) du bucket S3 créé."
  value       = aws_s3_bucket.this.id
}

output "bucket_arn" {
  description = "L'Amazon Resource Name (ARN) du bucket S3."
  value       = aws_s3_bucket.this.arn
}