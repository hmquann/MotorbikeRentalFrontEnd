class UploadAdapter {
  constructor(loader) {
    this.loader = loader;
    this.url = "https://rentalmotorbikewebapp.azurewebsites.net/api/uploads"; // Ensure this is your correct upload URL
  }

  upload() {
    return this.loader.file.then(
      (file) =>
        new Promise((resolve, reject) => {
          const data = new FormData();
          data.append("file", file);

          fetch(this.url, {
            method: "POST",
            body: data,
          })
            .then((response) => {
              if (!response.ok) {
                return response.text().then((text) => {
                  reject(
                    new Error(
                      `Upload failed: ${response.status} ${response.statusText}: ${text}`
                    )
                  );
                });
              }
              return response.json();
            })
            .then((data) => {
              if (!data || !data.url) {
                return reject(new Error("Invalid response from server"));
              }
              resolve({
                default: data.url,
              });
            })
            .catch((error) => {
              reject(error);
            });
        })
    );
  }

  abort() {
    // Abort the upload process if needed
  }
}

export default UploadAdapter;
