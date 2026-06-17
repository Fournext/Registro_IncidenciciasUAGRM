// =========================================================================
// SERVICIO B: FIREBASE STORAGE (Real - REST API oficial sin dependencias)
// =========================================================================
export class AdaptableFirebase {
  private BUCKET_NAME = "arquisw-2b741.firebasestorage.app";

  public async SubirAFirebase(file: File): Promise<string | null> {
    const filename = `incidencias/${Date.now()}_${file.name}`;
    const encodedName = encodeURIComponent(filename);

    const response = await fetch(
      `https://firebasestorage.googleapis.com/v0/b/${this.BUCKET_NAME}/o?name=${encodedName}`,
      {
        method: "POST",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      }
    );

    if (!response.ok) {
      throw new Error("Error físico al subir a Firebase Storage.");
    }

    const data = await response.json();
    const downloadToken = data.downloadTokens;
    return `https://firebasestorage.googleapis.com/v0/b/${this.BUCKET_NAME}/o/${encodedName}?alt=media&token=${downloadToken}`;
  }

  public async ObtenerRutaFirebase(filename: string): Promise<string | null> {
    const encodedName = encodeURIComponent(filename);
    const response = await fetch(
      `https://firebasestorage.googleapis.com/v0/b/${this.BUCKET_NAME}/o/${encodedName}`
    );
    if (!response.ok) return null;
    const data = await response.json();
    const downloadToken = data.downloadTokens;
    return `https://firebasestorage.googleapis.com/v0/b/${this.BUCKET_NAME}/o/${encodedName}?alt=media&token=${downloadToken}`;
  }

}
