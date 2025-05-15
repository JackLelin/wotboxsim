let selectedtanks = [];
let gaTankLeft;
const gaTankList = [50, 40, 20];

const alltanks = ["Ch54", "A155", "A150", "A132", "G44", "Pl27", "G174", "Cz32", "Pl26", "S25", "F122", "GB84", "R122", "S30", "F132", "G165", "G171", "A149"];

const t1list = ["A132", "A149", "A155", "G44", "Pl26", "R122", "S25", "Pl27", "G174", "F122"]
const t2list = ["Cz32", "S30", "G171", "Ch54", "G165"]
const t3list = ["A150", "F132", "GB84"]

const t1tankcdf = [0.08,0.16,0.24,0.32,0.40,0.48,0.61,0.74,0.87,1]
const t2tankcdf = [0.1, 0.45, 0.80, 0.85, 1]
const t3tankcdf = [0.4, 0.6, 1]

const t1boxcdf = [0.23, 0.98, 1]
const t2boxcdf = [0.02, 0.25, 1]
const t3boxcdf = [0.75, 0.98, 1]

let box_bought = 0;
let t1box = 0;
let t2box = 0;
let t3box = 0;

let t1cum = 0;
let t2cum = 0;
let t3cum = 0;

let newtanks = [];

let nohavelist;

window.onload = function(){
    initialize();
    addTanks();
}

function addTanks() {
    for(let i = 0; i < alltanks.length; i++) {
        let img = document.createElement("img");
        img.src = "./tanks/"+alltanks[i]+".png";
        let tile = document.createElement("button");
        tile.appendChild(img);
        tile.id = alltanks[i];
        tile.classList.add("tanks");
        tile.addEventListener("click", selectTank);
        if(t1list.includes(alltanks[i]))
            document.getElementById("tank_own_T1").append(tile);
        else if (t2list.includes(alltanks[i]))
            document.getElementById("tank_own_T2").append(tile);
        else if (t3list.includes(alltanks[i]))
            document.getElementById("tank_own_T3").append(tile);
    }
}

function initialize()
{
    nohavelist = Array.from(alltanks);
    gaTankLeft = Array.from(gaTankList);

    document.getElementById("buy-box").addEventListener("click", buyBox);
    document.getElementById("opent1").addEventListener("click", opent1box);
    document.getElementById("opent2").addEventListener("click", opent2box);
    document.getElementById("opent3").addEventListener("click", opent3box);
}

function buyBox()
{
    let boxnum = parseInt(document.getElementById("boxnum").value);
    if(!isNaN(boxnum) && boxnum > 0 )
    {
        box_bought += boxnum;
        t1box += boxnum;
        document.getElementById("box_bought").innerText = box_bought.toString();
        document.getElementById("t1box").innerText = t1box.toString();
    }
}

function opent1box()
{
    let box = t1box;
    t1box = 0;
    document.getElementById("t1box").innerText = t1box.toString();
    openBox(box, 0.02, t1boxcdf, t1tankcdf, t1list, 1);
}

function opent2box()
{
    box = t2box;
    t2box = 0;
    document.getElementById("t1box").innerText = t2box.toString();
    openBox(box, 0.05, t2boxcdf, t2tankcdf, t2list, 2);
}
function opent3box()
{
    box = t3box;
    t3box = 0;
    document.getElementById("t1box").innerText = t3box.toString();
    openBox(box, 0.1, t3boxcdf, t3tankcdf, t3list, 3);
}

function openBox(bnum, prob, boxCDF, tankCDF, tankList, tier)
{    
    countTank();
    for(t of newtanks)
        t.remove()
    if(bnum <=0)
        return;
    let t1boxtemp = 0;
    let t2boxtemp = 0;
    let t3boxtemp = 0;
    let bi;
    let r;

    for(let b =0; b<bnum; b++)
    {
        r = Math.random();
        if(r < 0.2)
        {
            bi = getLucky(boxCDF)
            if(bi == 0)
                t1boxtemp += 1;
            else if(bi == 1)
                t2boxtemp += 1;
            else if(bi == 2)
                t3boxtemp += 1;            
        }

        r = Math.random();
        if(r < prob)
        {
            gaTankLeft[tier-1] = gaTankList[tier-1]
            t3boxtemp += getTank(tier, tankCDF, tankList);
        }
        else
        {
            gaTankLeft[tier-1] --;
            if (gaTankLeft[tier-1] == 0)
            {
                gaTankLeft[tier-1] = gaTankList[tier-1]
                t3boxtemp += getTank(tier, tankCDF, tankList);
            }
        }
    }

    console.log("gaTankLeft:",gaTankLeft);
    console.log("nohavelist:",nohavelist);

    t1box += t1boxtemp;
    t2box += t2boxtemp;
    t3box += t3boxtemp;

    document.getElementById("t1box").innerText = t1box.toString();
    document.getElementById("t2box").innerText = t2box.toString();
    document.getElementById("t3box").innerText = t3box.toString();
    
    document.getElementById("box_t1_new").innerText = t1boxtemp.toString();
    document.getElementById("box_t2_new").innerText = t2boxtemp.toString();
    document.getElementById("box_t3_new").innerText = t3boxtemp.toString();

    t1cum += t1boxtemp;
    t2cum += t2boxtemp;
    t3cum += t3boxtemp;

    document.getElementById("box_t1_cum").innerText = (t1cum).toString();
    document.getElementById("box_t2_cum").innerText = (t2cum).toString();
    document.getElementById("box_t3_cum").innerText = (t3cum).toString();
}

function getLucky(CDF)
{
    r = Math.random();
    for(i = 0; i<CDF.length; i++)
    {
        if(r<CDF[i])
            return i
    }
}

function getTank(tier, tankCDF, tankList)
{
    let id_new, id_cum;

    for(let i=0; i<tankList.length; i++)
    {
        if(nohavelist.includes(tankList[i]))
            break;
        else if(i == tankList.length-1)
            return 1;
    }

    while(1)
    {
        ti = getLucky(tankCDF);
        let index = nohavelist.indexOf(tankList[ti]);
        if(index>-1)
        {
            nohavelist.splice(index, 1);
            if(tier == 1)
            {
                id_new = 'tank_T1_new';
                id_cum = 'tank_T1_cum';
            }
            else if (tier == 2)
            {
                id_new = 'tank_T2_new';
                id_cum = 'tank_T2_cum';
            }
            else if (tier == 3)
            {
                id_new = 'tank_T3_new';
                id_cum = 'tank_T3_cum';
            }

            let tile = document.createElement("img");
            tile.src = "./tanks/"+tankList[ti]+".png";
            tile.classList.add("tanks");
            document.getElementById(id_new).append(tile);
            newtanks.push(tile);

            tile = document.createElement("img");
            tile.src = "./tanks/"+tankList[ti]+".png";
            tile.classList.add("tanks");
            document.getElementById(id_cum).append(tile);

            return 0;
        }
    }
}

function countTank()
{
    let index;
    for(t of selectedtanks)
    {
        index = nohavelist.indexOf(t);
        if (index > -1) 
            nohavelist.splice(index, 1);
    }
}

function selectTank()
{
    let index = selectedtanks.indexOf(this.id);
    if (index > -1) {
        selectedtanks.splice(index, 1);
        this.classList.remove("tanks_checked");
    }
    else
    {
        selectedtanks.push(this.id)
        this.classList.add("tanks_checked");
    }
}




