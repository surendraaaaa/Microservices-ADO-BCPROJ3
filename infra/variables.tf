variable "aws_region" {
  type    = string
  default = "us-east-2"
}

variable "vpc_cidr" {
  type    = string
  default = "10.0.0.0/16"
}

variable "public_subnet_cidrs" {
  type    = list(string)
  default = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnet_cidrs" {
  type    = list(string)
  default = ["10.0.11.0/24", "10.0.12.0/24"]
}

variable "azs" {
  type    = list(string)
  default = ["us-east-2a", "us-east-2b"]
}

variable "key_name" {
  type    = string
  default = "MyAWSKP"
}

variable "instance_types" {
  type    = list(string)
  default = ["m7i-flex.large"]
}

variable "node_group_desired" {
  type    = number
  default = 2
}

variable "node_group_min" {
  type    = number
  default = 1
}

variable "node_group_max" {
  type    = number
  default = 3
}
