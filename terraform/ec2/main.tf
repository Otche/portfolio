# main.tf

# Configuration des Providers requis
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    tls = { # Utilisé pour générer la paire de clés privée/publique
      source  = "hashicorp/tls"
      version = "~> 4.0"
    }
  }
}

# 1. Configuration du Provider AWS
# Il utilise automatiquement les variables d'environnement (AWS_ACCESS_KEY_ID et AWS_SECRET_ACCESS_KEY)
provider "aws" {
  region = var.aws_region
}

# Data Source : Recherche la dernière AMI Ubuntu 22.04 LTS
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # ID du compte Canonical (images officielles Ubuntu)
  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }
  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# 2. Création d'une nouvelle clé SSH (KeyPair)
# Génère la clé privée (locale) et extrait la clé publique pour AWS
resource "tls_private_key" "ssh_key" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "aws_key_pair" "key_pair" {
  key_name   = var.key_name
  public_key = tls_private_key.ssh_key.public_key_openssh
}

# Sauvegarde la clé privée localement pour la connexion
resource "local_file" "private_key" {
  content  = tls_private_key.ssh_key.private_key_pem
  filename = "${var.key_name}.pem"
}

# 3. Création du Groupe de Sécurité (Ports 22, 80, 443)
resource "aws_security_group" "web_sg" {
  name        = "web-server-portfolio-sg"
  description = "Allow SSH, HTTP, and HTTPS inbound traffic"

  # Port 22 (SSH)
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Attention: Ouvrir à tous (0.0.0.0/0) n'est pas recommandé pour la production
  }

  # Port 80 (HTTP)
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Port 443 (HTTPS)
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Autorise tout le trafic sortant
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# 4. Déploiement de l'Instance EC2
resource "aws_instance" "web_server" {
  ami             = data.aws_ami.ubuntu.id
  instance_type   = var.instance_type
  key_name        = aws_key_pair.key_pair.key_name
  security_groups = [aws_security_group.web_sg.name]

  tags = {
    Name = "UbuntuWebInstance-portfolio"
    OS   = "Ubuntu 22.04 LTS"
  }
}