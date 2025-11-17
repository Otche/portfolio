# outputs.tf
output "public_ip" {
  description = "L'adresse IP publique de l'instance EC2."
  value       = aws_instance.web_server.public_ip
}

output "ssh_key_file" {
  description = "Nom du fichier de clé privée SSH généré."
  value       = "${var.key_name}.pem"
}