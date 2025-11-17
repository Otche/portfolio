variable "aws_region" {
    description = "The AWS region for deployment."
    type        = string
    default     = "eu-west-3" # Example: Paris. Change if needed.
}

variable "instance_type" {
    description = "The EC2 instance type (t2.micro is eligible for free tier)."
    type        = string
    default     = "t2.nano"
}

variable "key_name" {
    description = "The name of the SSH key pair."
    type        = string
    default     = "terraform-ubuntu-key"
}