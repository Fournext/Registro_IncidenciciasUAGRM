import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// =========================================================================
// SERVICIO C: AWS S3 (Autenticado usando el SDK oficial de AWS)
// =========================================================================
export class AdaptableAmazonS3 {
  private BUCKET_NAME = "arqui3";
  private REGION = "us-east-2"; // Región estándar de AWS S3 para arqui3

  private s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      region: this.REGION,
      credentials: {
        accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID || "",
        secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || "",
      },
    });
  }

  public async SubirAS3(file: File): Promise<string | null> {
    const key = `incidencias/${Date.now()}_${file.name}`;
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const fileData = new Uint8Array(arrayBuffer);

      const command = new PutObjectCommand({
        Bucket: this.BUCKET_NAME,
        Key: key,
        Body: fileData, // Convertido a Uint8Array para evitar errores de ReadableStream en navegadores
        ContentType: file.type,
      });

      // El SDK firma la petición automáticamente usando Signature V4 con tus credenciales
      await this.s3Client.send(command);
      return `https://${this.BUCKET_NAME}.s3.${this.REGION}.amazonaws.com/${key}`;
    } catch (error) {
      console.error("Error al subir a AWS S3 mediante SDK:", error);
      throw new Error(`Error físico al subir a AWS S3. Estado: ${(error as Error).message}`);
    }
  }

  public async ObtenerUrlS3(key: string): Promise<string | null> {
    return `https://${this.BUCKET_NAME}.s3.${this.REGION}.amazonaws.com/${key}`;
  }
}
