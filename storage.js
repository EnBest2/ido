// LocalStorage adatkezelő modul

const Storage = {
  // Felhasználói e-mail mentése
  saveUserEmail: function(email) {
    localStorage.setItem("userEmail", email);
  },

  // Felhasználói e-mail lekérdezése
  getUserEmail: function() {
    return localStorage.getItem("userEmail");
  },

  // Tananyagok lekérése (tömbként)
  getMaterials: function() {
    const data = localStorage.getItem("materials");
    return data ? JSON.parse(data) : [];
  },

  // Tananyagok mentése
  saveMaterials: function(materials) {
    localStorage.setItem("materials", JSON.stringify(materials));
  },

  // Új tananyag hozzáadása
  addMaterial: function(material) {
    const materials = this.getMaterials();
    materials.push(material);
    this.saveMaterials(materials);
  },

  // Összes adat (felhasználói e-mail és tananyagok) egy objektumba exportálva
  getAllData: function() {
    return {
      userEmail: this.getUserEmail(),
      materials: this.getMaterials()
    };
  }
};
