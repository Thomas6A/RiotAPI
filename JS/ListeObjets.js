document.addEventListener("DOMContentLoaded", async function () {
  dernierObjet = 0;
  let types = [];
  let objets = [];
  let plus = document.getElementById("plus");
  let desc = document.getElementById("desc");
  let searchButton = document.getElementById("searchButton");
  let selectedTypes = document.getElementById("types");
  let imageObjet = document.getElementById("imageObjet");

  searchButton.addEventListener("click", searchObjet);

  await fetch(
    "http://ddragon.leagueoflegends.com/cdn/13.10.1/data/fr_FR/item.json",
    "GET",
    printObjet
  );
  

  function fetch(url, method, fun) {
    const request = new XMLHttpRequest();
    request.addEventListener("load", fun);
    request.open(method, url);
    request.setRequestHeader("Accept", "application/json");
    request.send();
  }

  function printObjet() {
    let result = JSON.parse(this.response);
    const limite = 9;
    let fin_index = dernierObjet + limite;
    objets = Object.values(result.data).filter(
      (objets) => objets.gold.base != 0
    );
    detailObjet(objets[0]);
    console.log(objets);
    if (fin_index > objets.length) {
      fin_index = objets.length;
    }
    let set = new Set();
    objets.forEach((objet) => {
      objet.tags.forEach((tag) => {
        set.add(tag);
      });
    });
    types = Array.from(set);

    for (let i = dernierObjet; i < fin_index; i++) {
      let objet = objets[i];
      let li = document.createElement("li");
      let link = document.createElement("a");
      link.href = "#";
      let img = document.createElement("img");
      img.src = `http://ddragon.leagueoflegends.com/cdn/13.11.1/img/item/${objet.image.full}`;
      link.append(img);
      let span = document.createElement("span");
      span.innerHTML += objet.name;
      link.append(span);
      link.addEventListener("click", function () {
        detailObjet(objet);
      });
      li.append(link);
      document.getElementById("jokes").append(li);
    }
    dernierObjet = fin_index;
    selectTypes();
  }

  plus.addEventListener("click", function () {
    fetch(
      "http://ddragon.leagueoflegends.com/cdn/13.10.1/data/fr_FR/item.json",
      "GET",
      printObjet
    );
  });

  function searchObjet() {
    let searchTerm = document.getElementById("searchInput").value.toLowerCase();
    fetch(
      "http://ddragon.leagueoflegends.com/cdn/13.10.1/data/fr_FR/item.json",
      "GET",
      function () {
        let result = JSON.parse(this.response);
        let objets = Object.values(result.data).filter(
          (objets) => objets.gold.base != 0
        );
        let filteredResults;
        if (selectedTypes.value === "") {
          filteredResults = objets.filter((objets) =>
            objets.name.toLowerCase().includes(searchTerm)
          );
        } else {
          filteredResults = objets.filter(
            (objets) =>
              objets.name.toLowerCase().includes(searchTerm) &&
              objets.tags.includes(selectedTypes.value)
          );
        }
        document.getElementById("jokes").textContent = "";
        filteredResults.forEach((objet) => {
          let li = document.createElement("li");
          let link = document.createElement("a");
          link.href = "#";
          let img = document.createElement("img");
          img.src = `http://ddragon.leagueoflegends.com/cdn/13.11.1/img/item/${objet.image.full}`;
          link.append(img);
          link.innerHTML += objet.name;
          link.addEventListener("click", function () {
            detailObjet(objet);
          });
          li.append(link);
          document.getElementById("jokes").append(li);
          plus.style.display = "none";
        });
      }
    );
  }

  async function detailObjet(objet) {
    desc.innerHTML = "";
    imageObjet.innerHTML = "";

    let img = document.createElement("img");
    img.src = `http://ddragon.leagueoflegends.com/cdn/13.11.1/img/item/${objet.image.full}`;
    imageObjet.append(img);

    let h1 = document.createElement("h1");
    h1.textContent = objet.name;
    desc.append(h1);

    let role = document.createElement("p");
    role.textContent = "Types : ";
    objet.tags.forEach((roles) => {
      role.textContent += roles + ", ";
    });
    desc.append(role);

    let plore = document.createElement("p");
    plore.textContent = objet.plaintext;
    desc.append(plore);

    let achat = document.createElement("p");
    achat.textContent = "Prix d'achat : " + objet.gold.base + " golds";
    desc.append(achat);

    let vente = document.createElement("p");
    vente.textContent = "Prix de vente : " + objet.gold.sell + " golds";
    desc.append(vente);
  }

  function selectTypes() {
    types.forEach((type) => {
      let option = document.createElement("option");
      option.innerHTML = type;
      option.value = type;
      selectedTypes.append(option);
    });
  }
});
