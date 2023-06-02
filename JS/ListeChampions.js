document.addEventListener("DOMContentLoaded", async function () {
  dernierChampion = 0;
  let types = [];
  let chartInstance;
  let plus = document.getElementById("plus");
  let splash = document.getElementById("splash");
  let desc = document.getElementById("desc");
  let graph = document.getElementById("graph");
  let passifs = document.getElementById("passifs");
  let actifs = document.getElementById("actifs");
  let searchButton = document.getElementById("searchButton");
  let selectedTypes = document.getElementById("types");

  searchButton.addEventListener("click", searchChampion);

  await fetch(
    "http://ddragon.leagueoflegends.com/cdn/13.10.1/data/fr_FR/champion.json",
    "GET",
    printChampion
  );
  await detailChampion("Aatrox");

  function fetch(url, method, fun) {
    const request = new XMLHttpRequest();
    request.addEventListener("load", fun);
    request.open(method, url);
    request.setRequestHeader("Accept", "application/json");
    request.send();
  }

  function printChampion() {
    let result = JSON.parse(this.response);
    const limite = 6;
    let fin_index = dernierChampion + limite;
    let champions = Object.values(result.data);
    if (fin_index > champions.length) {
      fin_index = champions.length;
    }
    let set = new Set();
    champions.forEach((champion) => {
      champion.tags.forEach((tag) => {
        set.add(tag);
      });
    });
    types = Array.from(set);

    for (let i = dernierChampion; i < fin_index; i++) {
      let champion = champions[i];
      let li = document.createElement("li");
      let link = document.createElement("a");
      link.href = "#";
      let img = document.createElement("img");
      img.src = `http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champion.id}_0.jpg`;
      link.append(img);
      let span = document.createElement("span");
      span.innerHTML += champion.name;
      link.append(span);
      link.addEventListener("click", function () {
        detailChampion(champion.id);
      });
      li.append(link);
      document.getElementById("jokes").append(li);
    }
    dernierChampion = fin_index;
    selectTypes();
  }

  plus.addEventListener("click", function () {
    fetch(
      "http://ddragon.leagueoflegends.com/cdn/13.10.1/data/fr_FR/champion.json",
      "GET",
      printChampion
    );
  });

  function searchChampion() {
    let searchTerm = document.getElementById("searchInput").value.toLowerCase();
    fetch(
      "http://ddragon.leagueoflegends.com/cdn/13.10.1/data/fr_FR/champion.json",
      "GET",
      function () {
        let result = JSON.parse(this.response);
        let champions = Object.values(result.data);
        let filteredResults;
        if (selectedTypes.value === "") {
          if (isNaN(searchTerm)) {
            filteredResults = champions.filter(
              (champions) =>
                champions.name.toLowerCase().includes(searchTerm)
            );
          } else {
            filteredResults = champions.filter(
              (champions) =>
                champions.key === searchTerm
            );
          }
        }else{
          filteredResults = champions.filter(
            (champions) =>
              champions.name.toLowerCase().includes(searchTerm) &&
              champions.tags.includes(selectedTypes.value))
        }
        document.getElementById("jokes").textContent = "";
        filteredResults.forEach((champion) => {
          let li = document.createElement("li");
          let link = document.createElement("a");
          link.href = "#";
          let img = document.createElement("img");
          img.src = `http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champion.id}_0.jpg`;
          link.append(img);
          link.innerHTML += champion.name;
          link.addEventListener("click", function () {
            detailChampion(champion.id);
          });
          li.append(link);
          document.getElementById("jokes").append(li);
          plus.style.display = "none";
        });
      }
    );
  }

  async function detailChampion(id) {
    splash.innerHTML = "";
    let img = document.createElement("img");
    img.src = `http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${id}_0.jpg`;
    splash.append(img);

    fetch(
      `http://ddragon.leagueoflegends.com/cdn/13.10.1/data/fr_FR/champion/${id}.json`,
      "GET",
      function () {
        let result = JSON.parse(this.response);
        let champion = result.data[id];
        console.log(champion);

        desc.innerHTML = "";
        let h1 = document.createElement("h1");
        h1.textContent = champion.name;
        desc.append(h1);
        let role = document.createElement("p");
        role.textContent = "Rôles : ";
        champion.tags.forEach((roles) => {
          role.textContent += roles + ", ";
        });
        desc.append(role);
        let plore = document.createElement("p");
        plore.textContent = champion.lore;
        desc.append(plore);

        if (chartInstance) {
          chartInstance.destroy();
        }
        chartStat(champion.info);

        actifs.innerHTML = "";
        champion.spells.forEach((spell) => {
          let spellp = document.createElement("p");
          let imgSpell = document.createElement("img");
          imgSpell.src = `http://ddragon.leagueoflegends.com/cdn/13.10.1/img/spell/${spell.id}.png`;
          spellp.append(imgSpell);
          spellp.innerHTML += spell.name + " : " + spell.description;
          actifs.append(spellp);
        });

        passifs.innerHTML = "";
        let passifp = document.createElement("p");
        let imgPassif = document.createElement("img");
        imgPassif.src = `http://ddragon.leagueoflegends.com/cdn/13.10.1/img/passive/${champion.passive.image.full}`;
        passifp.append(imgPassif);
        passifp.innerHTML +=
          champion.passive.name + " : " + champion.passive.description;
        passifs.append(passifp);
      }
    );
  }

  function chartStat(info) {
    let statNumber = Object.values(info);

    let statName = ["attack", "defense", "difficulty", "magic"];

    let data = {
      labels: statName,
      datasets: [
        {
          label: "Champion",
          data: statNumber,
          fill: true,
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "#7ef3f7",
          pointBackgroundColor: "#7ef3f7",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "rgb(255, 99, 132)",
        },
      ],
    };

    let config = {
      type: "radar",
      data: data,
      options: {
        elements: {
          line: {
            borderWidth: 3,
          },
        },
        scales: {
          r: {
            angleLines: {
              display: true,
            },
            suggestedMin: 0,
            suggestedMax: 10,
            pointLabels: {
              color: "black",
            },
          },
        },
      },
    };

    chartInstance = new Chart(graph, config);
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
