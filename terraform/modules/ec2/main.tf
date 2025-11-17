


# Recherche de l'AMI (méthode de recherche par nom, comme dans l'exemple initial)
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # ID du compte Canonical (images officielles Ubuntu)
  filter {
    name   = "image-id"
    values = ["ami-0ef9bcd5dfb57b968"]
  }
}

# Création de la paire de clés SSH (pour la connexion)
resource "aws_key_pair" "key_pair" {
  key_name   = var.key_name
  public_key = var.public_key # Clé publique fournie en variable
}

# Déploiement de l'Instance EC2
resource "aws_instance" "web_server" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = var.instance_type
  key_name      = aws_key_pair.key_pair.key_name

  # ASSOCIER LE SECURITY GROUP :
  vpc_security_group_ids = [var.security_group_id]

  tags = {
    Name = var.instance_name
  }
}