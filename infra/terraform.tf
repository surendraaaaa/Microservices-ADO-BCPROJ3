terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 4.60.0" # safe modern provider
    }
  }

  # enable remote backend (Terraform Cloud) or configure S3 backend here
  cloud {
     organization = "my-remote-backend"
      workspaces {
       name = "dev"
     }
   }
}


