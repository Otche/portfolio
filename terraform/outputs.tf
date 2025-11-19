output "instance_ip" {
  description = "IP publique de l'instance Web."
  value       = module.web_instance.public_ip
}


output "private_key_path" {
  description = "Chemin vers la clé privée SSH générée localement."
  value       = local_file.private_key.filename
}