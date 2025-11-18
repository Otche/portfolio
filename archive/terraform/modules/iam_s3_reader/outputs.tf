# outputs.tf du module iam_s3_reader

output "s3_reader_profile_name" {
  description = "Nom du Profil d'Instance à attacher à l'EC2."
  value       = aws_iam_instance_profile.s3_reader_profile.name
}