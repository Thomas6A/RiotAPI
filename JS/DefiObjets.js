document.addEventListener("DOMContentLoaded", async function () {
    let items = [];
    let item;
    let timerId
    let score = 0;
    let essais = 7;
    let essaisParItem = 0;
    let remainingSeconds = 60;
    let start = document.getElementById("start");
    let resultats = document.getElementById("resultats");
    let reste = document.getElementById("reste");
    let scoretext = document.getElementById("score");
    let objetImage = document.getElementById("objetImage");
    let indice1 = document.getElementById("indice1");
    let indice2 = document.getElementById("indice2");
    let indice3 = document.getElementById("indice3");
    let submitbutton = document.getElementById("searchButton");
    let answerinput = document.getElementById("searchInput");
  
    start.addEventListener("click", getItem);
    start.addEventListener("click", updateTimer);
    submitbutton.addEventListener("click", reponseQuestion);
  
    await fetch(
      "http://ddragon.leagueoflegends.com/cdn/13.10.1/data/fr_FR/item.json",
      "GET",
      getAllItem
    );
  
    function fetch(url, method, fun) {
      const request = new XMLHttpRequest();
      request.addEventListener("load", fun);
      request.open(method, url);
      request.setRequestHeader("Accept", "application/json");
      request.send();
    }
  
    function getAllItem() {
      let result = JSON.parse(this.response);
      items = Object.values(result.data).filter(
        (objets) => objets.gold.base != 0
      );
    }
  
    async function getItem() {
      item = items[Math.floor(Math.random() * items.length)];
      quizz();
    }
  
    async function quizz() {
      start.style.display = "none";
      submitbutton.disabled = "";
      scoretext.innerHTML = "Votre score est de : " + score;
      reste.innerHTML = "Il vous reste " + essais + " essais et "+remainingSeconds+" secondes";
      objetImage.innerHTML = "";
      let img = document.createElement("img");
      img.src = `http://ddragon.leagueoflegends.com/cdn/13.11.1/img/item/${item.image.full}`;
      objetImage.append(img);
  
      indice1.innerHTML = "";
      let indicerole = document.createElement("p");
      indicerole.textContent = "Indice n°1 : Rôles : ";
      item.tags.forEach((roles) => {
        indicerole.textContent += roles + ", ";
      });
      indice1.append(indicerole);
  
      indice2.innerHTML = "";
      let indicepassive = document.createElement("p");
      indicepassive.textContent =
        "Indice n°2 : Prix d'achat : " + item.gold.base;
      indice2.append(indicepassive);
  
      indice3.innerHTML = "";
      let indicelore = document.createElement("p");
      indicelore.textContent = "Indice n°3 : Description : " + item.plaintext;
      indice3.append(indicelore);
    }
  
    async function reponseQuestion() {
      let reponse = answerinput.value.toLowerCase();
      setInterval(function () {
        let minutes = Math.floor(remainingSeconds / 60);
        let seconds = remainingSeconds % 60;
      }, 1000);
      if (reponse === item.name.toLowerCase()) {
        resultats.innerHTML = "";
        score += 1;
        essaisParItem = 0;
        let result = document.createElement("p");
        result.innerHTML = "Votre réponse est : ";
        let span = document.createElement("span");
        span.innerHTML = "vrai";
        span.style.color = "green";
        result.append(span);
        resultats.append(result);
        indice1.classList.add("cache");
        indice2.classList.add("cache");
        indice3.classList.add("cache");
        await getItem();
      } else if (item.name.toLowerCase().includes(reponse)) {
        resultats.innerHTML = "";
        essais -= 1;
        essaisParItem += 1;
        let result = document.createElement("p");
        result.innerHTML = "Votre réponse est : ";
        let span = document.createElement("span");
        span.innerHTML = "Partielle";
        span.style.color = "orange";
        result.append(span);
        console.log(resultats);
        resultats.append(result);
        reste.innerHTML = "Il vous reste " + essais + " essais et "+remainingSeconds+" secondes";
      } else if (
        items.some((objet) => objet.name.toLowerCase() === reponse)
      ) {
        const itemMatch = items.find(
          (objet) => objet.name.toLowerCase() === reponse
        );
        if (item.tags.every(tag => itemMatch.tags.includes(tag))) {
          resultats.innerHTML = "";
          essais -= 1;
          essaisParItem += 1;
          let result = document.createElement("p");
          result.innerHTML = "Votre réponse est : ";
          let span = document.createElement("span");
          span.innerHTML = "de la meme classe";
          span.style.color = "orange";
          result.append(span);
          console.log(resultats);
          resultats.append(result);
          reste.innerHTML = "Il vous reste " + essais + " essais et "+remainingSeconds+" secondes";
        } else {
          resultats.innerHTML = "";
          essais -= 1;
          essaisParItem += 1;
          let result = document.createElement("p");
          result.innerHTML = "Votre réponse est : ";
          let span = document.createElement("span");
          span.innerHTML = "un autre objet";
          span.style.color = "red";
          result.append(span);
          console.log(resultats);
          resultats.append(result);
          reste.innerHTML = "Il vous reste " + essais + " essais et "+remainingSeconds+" secondes";
        }
      } else {
        resultats.innerHTML = "";
        essais -= 1;
        essaisParItem += 1;
        let result = document.createElement("p");
        result.innerHTML = "Votre réponse est : ";
        let span = document.createElement("span");
        span.innerHTML = "Fausse";
        span.style.color = "red";
        result.append(span);
        console.log(resultats);
        resultats.append(result);
        reste.innerHTML = "Il vous reste " + essais + " essais et "+remainingSeconds+" secondes";
      }
      if (essaisParItem === 1) {
        indice1.classList.remove("cache");
      } else if (essaisParItem === 2) {
        indice2.classList.remove("cache");
      } else if (essaisParItem === 3) {
        indice3.classList.remove("cache");
      }
      if (essais === 0) {
        clearTimeout(timerId);
        alert(
          "Partie terminé, votre score est de : " +
            score +
            "\nCliquez sur start pour recommencer"
        );
        essais = 7;
        score = 0;
        essaisParItem = 0;
        indice1.classList.add("cache");
        indice2.classList.add("cache");
        indice3.classList.add("cache");
        start.style.display = "block";
        submitbutton.disabled = "disabled";
        remainingSeconds = 60
      }
    }
    function updateTimer() {
      remainingSeconds--;
      if (remainingSeconds >= 0) {
        reste.innerHTML = ""
        reste.innerHTML = "Il vous reste " + essais + " essais et "+remainingSeconds+" secondes";
        timerId = setTimeout(updateTimer, 1000);
      } else {
        alert(
          "Partie terminé, votre score est de : " +
            score +
            "\nCliquez sur start pour recommencer"
        );
        essais = 7;
        score = 0;
        essaisParItem = 0;
        indice1.classList.add("cache");
        indice2.classList.add("cache");
        indice3.classList.add("cache");
        start.style.display = "block";
        submitbutton.disabled = "disabled";
        remainingSeconds = 60
      }
    }
  });
  