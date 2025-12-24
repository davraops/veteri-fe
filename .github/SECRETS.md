# GitHub Secrets Configuration

Este documento lista todos los secrets que necesitas configurar en GitHub para que los workflows funcionen correctamente.

## Configuración en GitHub

Ve a: **Settings > Secrets and variables > Actions** en tu repositorio de GitHub.

**Nota importante**:

- **Secrets**: Para información sensible (credenciales AWS)
- **Variables**: Para información no sensible (URLs de API, nombres de app)

## Variables Requeridas (Variables, no Secrets)

Estas variables se usan durante el build de Vite. Configúralas como **Variables** (no Secrets):

### Variables Comunes (para todos los ambientes)

- `VITE_APP_NAME` - Nombre de la aplicación (ej: `My App`)

### Variables por Ambiente

- `VITE_API_URL_DEV` - URL de la API para desarrollo (ej: `https://dev-api.example.com`)
- `VITE_API_URL_TEST` - URL de la API para test (ej: `https://test-api.example.com`)
- `VITE_API_URL_PROD` - URL de la API para producción (ej: `https://api.example.com`)

## Secrets Requeridos

### AWS Credentials - Dev Environment

- `AWS_ACCESS_KEY_ID_DEV` - Access Key ID para el ambiente de desarrollo
- `AWS_SECRET_ACCESS_KEY_DEV` - Secret Access Key para el ambiente de desarrollo
- `AWS_S3_BUCKET_DEV` - Nombre del bucket S3 para Dev (ej: `my-app-dev`)
- `AWS_CLOUDFRONT_DISTRIBUTION_ID_DEV` - (Opcional) ID de distribución CloudFront para Dev

### AWS Credentials - Test Environment

- `AWS_ACCESS_KEY_ID_TEST` - Access Key ID para el ambiente de test
- `AWS_SECRET_ACCESS_KEY_TEST` - Secret Access Key para el ambiente de test
- `AWS_S3_BUCKET_TEST` - Nombre del bucket S3 para Test (ej: `my-app-test`)
- `AWS_CLOUDFRONT_DISTRIBUTION_ID_TEST` - (Opcional) ID de distribución CloudFront para Test

### AWS Credentials - Production Environment

- `AWS_ACCESS_KEY_ID_PROD` - Access Key ID para producción
- `AWS_SECRET_ACCESS_KEY_PROD` - Secret Access Key para producción
- `AWS_S3_BUCKET_PROD` - Nombre del bucket S3 para Prod (ej: `my-app-prod`)
- `AWS_CLOUDFRONT_DISTRIBUTION_ID_PROD` - (Opcional) ID de distribución CloudFront para Prod

### AWS Region (Común para todos)

- `AWS_REGION` - Región de AWS (ej: `us-east-1`, `eu-west-1`). Si no se configura, usa `us-east-1` por defecto.

## Notas

- Los IDs de CloudFront son opcionales. Si no los configuras, el workflow simplemente omitirá la invalidación de cache.
- Asegúrate de que los usuarios IAM tengan permisos para:
  - `s3:PutObject`
  - `s3:DeleteObject`
  - `s3:ListBucket`
  - `cloudfront:CreateInvalidation` (si usas CloudFront)
