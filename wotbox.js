let selectedtanks = [];
let gaTankLeft;
const gaTankList = [50, 40, 20];

const alltanks = ["Ch54", "A155", "A150", "A132", "G44", "Pl27", "G174", "Cz32", "Pl26", "S25", "F122", "GB84", "R122", "S30", "F132", "G165", "G171", "A149"];
const tanknames = ["BZ-72-1", "AAT60", "MBTB", "T77", "Jagdtiger P", "Grom", "Turm", "Medved", "Pancernik", "Emil 1951", "VCS 6xt", "Chieftain", "T-44-100", "UDES 033", "Vercingetorix", "Kpz EK", "E77", "AMBT"];

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
        const tankId = alltanks[i];
        
        // Create container div for tank image and name
        const container = document.createElement("div");
        container.classList.add("tank-container");
        container.id = tankId;
        container.addEventListener("click", selectTank);
        
        // Create and add the image
        const img = document.createElement("img");
        img.src = "./tanks/"+tankId+".png";
        img.alt = tankId;
        container.appendChild(img);
        
        // Create and add the tank name label
        const nameLabel = document.createElement("div");
        nameLabel.classList.add("tank-name");
        nameLabel.textContent = tanknames[i];
        container.appendChild(nameLabel);
        
        // Add to appropriate tier section
        if(t1list.includes(tankId))
            document.getElementById("tank_own_T1").append(container);
        else if (t2list.includes(tankId))
            document.getElementById("tank_own_T2").append(container);
        else if (t3list.includes(tankId))
            document.getElementById("tank_own_T3").append(container);
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
    document.getElementById("automate").addEventListener("click", automateOpenBoxes);
    document.getElementById("run-simulation").addEventListener("click", runSimulation);
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
    let box = t2box;
    t2box = 0;
    document.getElementById("t2box").innerText = t2box.toString();
    openBox(box, 0.05, t2boxcdf, t2tankcdf, t2list, 2);
}
function opent3box()
{
    let box = t3box;
    t3box = 0;
    document.getElementById("t3box").innerText = t3box.toString();
    openBox(box, 0.1, t3boxcdf, t3tankcdf, t3list, 3);
}

function openBox(bnum, prob, boxCDF, tankCDF, tankList, tier)
{    
    countTank();
    // Remove previous "new" tanks
    for(let t of newtanks) {
        t.remove();
    }
    newtanks = [];
    
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
    let r = Math.random();
    for(let i = 0; i<CDF.length; i++)
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
        let ti = getLucky(tankCDF);
        let index = nohavelist.indexOf(tankList[ti]);
        if(index>-1)
        {
            let idx = alltanks.indexOf(tankList[ti]);

            const tankId = tankList[ti];
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

            // Create container for new tank with image and name
            const newContainer = document.createElement("div");
            newContainer.classList.add("tank-container");
            
            // Create and add image
            const img = document.createElement("img");
            img.src = "./tanks/"+tankId+".png";
            img.alt = tankId;
            newContainer.appendChild(img);
            
            // Create and add name
            const nameLabel = document.createElement("div");
            nameLabel.classList.add("tank-name");
            nameLabel.textContent = tanknames[idx];
            newContainer.appendChild(nameLabel);
            
            document.getElementById(id_new).append(newContainer);
            newtanks.push(newContainer);

            // Create container for cumulative tank with image and name
            const cumContainer = document.createElement("div");
            cumContainer.classList.add("tank-container");
            
            // Create and add image
            const cumImg = document.createElement("img");
            cumImg.src = "./tanks/"+tankId+".png";
            cumImg.alt = tankId;
            cumContainer.appendChild(cumImg);
            
            // Create and add name
            const cumNameLabel = document.createElement("div");
            cumNameLabel.classList.add("tank-name");
            cumNameLabel.textContent = tanknames[idx];
            cumContainer.appendChild(cumNameLabel);
            
            document.getElementById(id_cum).append(cumContainer);

            return 0;
        }
    }
}

function countTank()
{
    let index;
    for(let t of selectedtanks)
    {
        index = nohavelist.indexOf(t);
        if (index > -1) 
            nohavelist.splice(index, 1);
    }
}

function selectTank() {
    const tankId = this.id;
    let index = selectedtanks.indexOf(tankId);
    if (index > -1) {
        selectedtanks.splice(index, 1);
        this.classList.remove("tanks_checked");
    }
    else {
        selectedtanks.push(tankId);
        this.classList.add("tanks_checked");
    }
}

function automateOpenBoxes() {
    // Continue opening boxes until there are none left
    let count = 0;
    const maxIterations = 1000; // Safety limit to prevent infinite loops
    
    while ((t1box > 0 || t2box > 0 || t3box > 0) && count < maxIterations) {
        if (t1box > 0) {
            opent1box();
        }
        if (t2box > 0) {
            opent2box();
        }
        if (t3box > 0) {
            opent3box();
        }
        count++;
    }
    
    // Show status message
    if (count >= maxIterations) {
        alert("Automation stopped: reached maximum iterations. Some boxes might still remain.");
    } else {
        alert("All boxes opened successfully!");
    }
}

function runSimulation() {
    const populationSize = parseInt(document.getElementById("population-size").value) || 100;
    const targetTanks = parseInt(document.getElementById("target-tanks").value) || 1;
    
    if (targetTanks < 1 || targetTanks > 3) {
        alert("Please enter a number between 1 and 3 for target tanks.");
        return;
    }
    
    // Count already owned tanks by tier
    const alreadyOwnedT1Count = selectedtanks.filter(tank => t1list.includes(tank)).length;
    const alreadyOwnedT2Count = selectedtanks.filter(tank => t2list.includes(tank)).length;
    const alreadyOwnedT3Count = selectedtanks.filter(tank => t3list.includes(tank)).length;
    
    // If user already has all the target tanks, show a message
    if (alreadyOwnedT3Count >= targetTanks) {
        const resultsDiv = document.getElementById("simulation-results");
        resultsDiv.innerHTML = `<p>You already own ${alreadyOwnedT3Count} T3 tanks, which meets or exceeds your target of ${targetTanks} tanks. No additional boxes needed!</p>`;
        return;
    }
    
    // Calculate how many more T3 tanks we need to get
    const additionalT3Needed = targetTanks - alreadyOwnedT3Count;
    
    // Show loading message
    const resultsDiv = document.getElementById("simulation-results");
    resultsDiv.innerHTML = `<p>Running simulation for ${additionalT3Needed} more T3 tank(s)... please wait.</p>`;
    
    // Use setTimeout to allow the loading message to display
    setTimeout(() => {
        // Store data for histogram
        const boxesNeeded = [];
        let totalBoxes = 0;
        
        // Run simulation for each person
        for (let i = 0; i < populationSize; i++) {
            // Reset state for each simulation
            resetSimState();
            
            // Run simulation for current person
            const boxCount = simulateBoxesNeeded(additionalT3Needed);
            boxesNeeded.push(boxCount);
            totalBoxes += boxCount;
        }
        
        // Clear previous results
        resultsDiv.innerHTML = "";
        
        // Calculate precise statistics from raw data (not histogram)
        boxesNeeded.sort((a, b) => a - b); // Sort for percentiles
        
        // Simple statistics
        const min = boxesNeeded[0];
        const max = boxesNeeded[boxesNeeded.length - 1];
        const sum = boxesNeeded.reduce((a, b) => a + b, 0);
        const mean = sum / boxesNeeded.length;
        
        // Median (50th percentile) - precise calculation
        const medianIndex = Math.floor(boxesNeeded.length / 2);
        const median = boxesNeeded.length % 2 === 0 
            ? (boxesNeeded[medianIndex - 1] + boxesNeeded[medianIndex]) / 2
            : boxesNeeded[medianIndex];
            
        // Calculate percentiles precisely
        const p25Index = Math.floor(boxesNeeded.length * 0.25);
        const p75Index = Math.floor(boxesNeeded.length * 0.75);
        const p90Index = Math.floor(boxesNeeded.length * 0.90);
        
        const p25 = boxesNeeded[p25Index];
        const p75 = boxesNeeded[p75Index];
        const p90 = boxesNeeded[p90Index];
        
        // Standard deviation calculation
        const variance = boxesNeeded.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / boxesNeeded.length;
        const stdDev = Math.sqrt(variance);
        
        // Create header message that includes already owned tanks info
        const headerDiv = document.createElement("div");
        headerDiv.innerHTML = `
            <h3>Simulation Results for Getting ${additionalT3Needed} More T3 Tank(s)</h3>
            <p>Tanks you already own: ${alreadyOwnedT1Count}/${t1list.length} T1 tanks, 
            ${alreadyOwnedT2Count}/${t2list.length} T2 tanks, 
            ${alreadyOwnedT3Count}/${t3list.length} T3 tanks.</p>
            <p>This simulation shows how many boxes you need to get a total of ${targetTanks} T3 tank(s).</p>
        `;
        resultsDiv.appendChild(headerDiv);
        
        // Display detailed statistics
        const statsDiv = document.createElement("div");
        statsDiv.className = "stats-summary";
        statsDiv.innerHTML = `
            <table class="stats-table">
                <tr>
                    <th>Statistic</th>
                    <th>Boxes Needed</th>
                    <th>Description</th>
                </tr>
                <tr>
                    <td>Mean (Average)</td>
                    <td>${Math.round(mean)}</td>
                    <td>The average number of boxes needed</td>
                </tr>
                <tr>
                    <td>Median (50th percentile)</td>
                    <td>${median}</td>
                    <td>Half of people need fewer, half need more</td>
                </tr>
                <tr>
                    <td>25th percentile</td>
                    <td>${p25}</td>
                    <td>25% of people need this many or fewer</td>
                </tr>
                <tr>
                    <td>75th percentile</td>
                    <td>${p75}</td>
                    <td>75% of people need this many or fewer</td>
                </tr>
                <tr>
                    <td>90th percentile</td>
                    <td>${p90}</td>
                    <td>90% of people need this many or fewer</td>
                </tr>
                <tr>
                    <td>Standard Deviation</td>
                    <td>${Math.round(stdDev)}</td>
                    <td>Measure of variation in box counts</td>
                </tr>
                <tr>
                    <td>Minimum</td>
                    <td>${min}</td>
                    <td>Fewest boxes needed (very lucky)</td>
                </tr>
                <tr>
                    <td>Maximum</td>
                    <td>${max}</td>
                    <td>Most boxes needed (very unlucky)</td>
                </tr>
            </table>
        `;
        resultsDiv.appendChild(statsDiv);
        
        // Create histogram data - still useful for visualization
        const histogramData = createHistogram(boxesNeeded, min, max);
        
        // Create histogram visualization
        createHistogramVisualization(histogramData, resultsDiv);
    }, 50); // Small delay to allow UI to update
}

function resetSimState() {
    // Use the actual selected tanks from UI instead of resetting to empty
    // This makes simulation consider already owned tanks
    
    // Start with full list, then remove selected tanks
    nohavelist = Array.from(alltanks);
    
    // Remove tanks that user has selected as already owned
    for (let t of selectedtanks) {
        const index = nohavelist.indexOf(t);
        if (index > -1) {
            nohavelist.splice(index, 1);
        }
    }
    
    // Reset guaranteed acquisition counters
    gaTankLeft = Array.from(gaTankList);
    
    // Reset box counters
    t1box = 0;
    t2box = 0;
    t3box = 0;
    t1cum = 0;
    t2cum = 0;
    t3cum = 0;
    
    // Clear newtanks
    newtanks = [];
}

function simulateBoxesNeeded(targetT3Tanks) {
    let boxCount = 0;
    let t3TanksObtained = 0;
    const t3TankInitialCount = t3list.length;
    
    // Initial purchase of boxes - start with just 1 box
    let currentBoxBatch = 1;
    
    while (t3TanksObtained < targetT3Tanks) {
        // Add boxes
        boxCount += currentBoxBatch;
        t1box += currentBoxBatch;
        
        // Open all boxes until none left
        while (t1box > 0 || t2box > 0 || t3box > 0) {
            if (t1box > 0) simulateOpenT1Box();
            if (t2box > 0) simulateOpenT2Box();
            if (t3box > 0) simulateOpenT3Box();
        }
        
        // Count obtained T3 tanks
        t3TanksObtained = t3TankInitialCount - countRemainingTanks(t3list);
        
        // If we still need more tanks, increment by exactly 1 box at a time
        currentBoxBatch = 1;
    }
    
    return boxCount;
}

function countRemainingTanks(tankList) {
    let count = 0;
    for (let tank of tankList) {
        if (nohavelist.includes(tank)) {
            count++;
        }
    }
    return count;
}

function simulateOpenT1Box() {
    let box = t1box;
    t1box = 0;
    simulateOpenBox(box, 0.02, t1boxcdf, t1tankcdf, t1list, 1);
}

function simulateOpenT2Box() {
    let box = t2box;
    t2box = 0;
    simulateOpenBox(box, 0.05, t2boxcdf, t2tankcdf, t2list, 2);
}

function simulateOpenT3Box() {
    let box = t3box;
    t3box = 0;
    simulateOpenBox(box, 0.1, t3boxcdf, t3tankcdf, t3list, 3);
}

function simulateOpenBox(bnum, prob, boxCDF, tankCDF, tankList, tier) {
    if (bnum <= 0) return;
    
    let t1boxtemp = 0;
    let t2boxtemp = 0;
    let t3boxtemp = 0;
    
    for (let b = 0; b < bnum; b++) {
        // Chance to get additional boxes
        if (Math.random() < 0.2) {
            const bi = getLucky(boxCDF);
            if (bi == 0) t1boxtemp += 1;
            else if (bi == 1) t2boxtemp += 1;
            else if (bi == 2) t3boxtemp += 1;            
        }

        // Chance to get a tank
        if (Math.random() < prob) {
            gaTankLeft[tier-1] = gaTankList[tier-1];
            const result = simulateGetTank(tier, tankCDF, tankList);
            if (result === 1) {
                // If all tanks of this tier are collected, we get a box of next tier
                if (tier === 1) t2boxtemp += 1;
                else if (tier === 2) t3boxtemp += 1;
            }
        } else {
            gaTankLeft[tier-1]--;
            if (gaTankLeft[tier-1] == 0) {
                gaTankLeft[tier-1] = gaTankList[tier-1];
                const result = simulateGetTank(tier, tankCDF, tankList);
                if (result === 1) {
                    // If all tanks of this tier are collected, we get a box of next tier
                    if (tier === 1) t2boxtemp += 1;
                    else if (tier === 2) t3boxtemp += 1;
                }
            }
        }
    }
    
    // Update box counts
    t1box += t1boxtemp;
    t2box += t2boxtemp;
    t3box += t3boxtemp;
}

function simulateGetTank(tier, tankCDF, tankList) {
    // If all tanks from this tier are already obtained, return a higher tier box
    let allTanksObtained = true;
    for (let i = 0; i < tankList.length; i++) {
        if (nohavelist.includes(tankList[i])) {
            allTanksObtained = false;
            break;
        }
    }
    
    if (allTanksObtained) {
        // Return a higher tier box if all tanks are already obtained
        if (tier < 3) {
            return 1; // Return a box of the next tier
        }
        return 0; // For T3, no higher tier to return
    }

    // Keep trying until we get a tank we don't have
    while (true) {
        const ti = getLucky(tankCDF);
        const tankId = tankList[ti];
        const index = nohavelist.indexOf(tankId);
        
        if (index > -1) {
            nohavelist.splice(index, 1); // Remove from not-have list
            return 0;
        }
    }
}

function createHistogram(data, min, max) {
    // Count occurrences of each exact box number
    const boxCounts = {};
    
    // Count each box value
    for (const value of data) {
        if (!boxCounts[value]) {
            boxCounts[value] = 0;
        }
        boxCounts[value]++;
    }
    
    // Convert to arrays for visualization
    const boxValues = Object.keys(boxCounts).map(Number).sort((a, b) => a - b);
    const bins = boxValues.map(value => boxCounts[value]);
    const binLabels = boxValues.map(String);
    
    return { bins, binLabels, boxValues };
}

function createHistogramVisualization(histogramData, container) {
    const { bins, binLabels, boxValues } = histogramData;
    const totalPeople = bins.reduce((sum, count) => sum + count, 0);
    
    // Calculate all percentages first
    const percentages = bins.map(count => (count / totalPeople) * 100);
    
    // Find the maximum percentage (rounded up to nearest 5%)
    const maxPercentage = Math.ceil(Math.max(...percentages) / 5) * 5;
    
    // Create histogram container
    const histDiv = document.createElement("div");
    histDiv.className = "histogram";
    
    // Create title
    const title = document.createElement("h3");
    title.textContent = "Distribution of Boxes Needed";
    histDiv.appendChild(title);
    
    // Create chart container
    const chartContainer = document.createElement("div");
    chartContainer.className = "chart-container";
    
    // Add axis labels
    const xAxisLabel = document.createElement("div");
    xAxisLabel.className = "axis-label x-axis-label";
    xAxisLabel.textContent = "Number of Boxes Opened (exact count)";
    chartContainer.appendChild(xAxisLabel);
    
    const yAxisLabel = document.createElement("div");
    yAxisLabel.className = "axis-label y-axis-label";
    yAxisLabel.textContent = "Number of People";
    chartContainer.appendChild(yAxisLabel);
    
    // Create y-axis
    const yAxis = document.createElement("div");
    yAxis.className = "y-axis";
    chartContainer.appendChild(yAxis);
    
    // Find the maximum count for y-axis scaling
    const maxCount = Math.max(...bins);
    
    // Determine appropriate tick values based on maximum count
    let yTickValues = [];
    const tickCount = 5; // Target number of ticks
    const tickInterval = Math.ceil(maxCount / (tickCount - 1));
    
    // Generate tick marks from 0 to maxCount
    for (let i = 0; i <= maxCount; i += tickInterval) {
        yTickValues.push(i);
    }
    
    // Make sure we include the max value
    if (yTickValues[yTickValues.length - 1] !== maxCount) {
        yTickValues.push(maxCount);
    }
    
    // Add y-axis ticks
    yTickValues.forEach(value => {
        const tick = document.createElement("div");
        tick.className = "y-tick";
        tick.textContent = value;
        // Position from bottom as percentage of maxCount
        const position = (value / maxCount) * 100;
        tick.style.bottom = `${position}%`;
        yAxis.appendChild(tick);
    });
    
    // Create grid lines for better readability
    yTickValues.forEach(value => {
        if (value === 0) return; // Skip the 0 line (it's the x-axis)
        
        const gridLine = document.createElement("div");
        gridLine.className = "y-grid-line";
        // Position from bottom as percentage of maxCount
        const position = (value / maxCount) * 100;
        gridLine.style.bottom = `${position}%`;
        chartContainer.appendChild(gridLine);
    });
    
    // Create bars container with a wrapper to position x-ticks
    const barsContainer = document.createElement("div");
    barsContainer.className = "histogram-bars-container";
    
    const barsDiv = document.createElement("div");
    barsDiv.className = "histogram-bars";
    
    // Calculate min and max box values
    const minBoxValue = boxValues[0];
    const maxBoxValue = boxValues[boxValues.length - 1];
    const numBins = boxValues.length;
    
    // Always display all box counts, regardless of how many there are
    let displayBoxValues = boxValues;
    let displayBins = bins;
    let displayLabels = binLabels;
    
    // Add x-axis tick marks (about 10 major ticks and minor ticks in between)
    const xTickInterval = Math.ceil((maxBoxValue - minBoxValue) / 10);
    const minorTickInterval = Math.ceil(xTickInterval / 5);
    
    for (let i = minBoxValue; i <= maxBoxValue; i += minorTickInterval) {
        const xTick = document.createElement("div");
        const isMajor = (i % xTickInterval === 0);
        xTick.className = isMajor ? "x-tick x-tick-major" : "x-tick x-tick-minor";
        xTick.textContent = isMajor ? i : '';
        
        // Position relative to the total range
        const position = ((i - minBoxValue) / (maxBoxValue - minBoxValue)) * 100;
        xTick.style.left = `${position}%`;
        barsContainer.appendChild(xTick);
    }
    
    // Create bars - using all data points with adjusted width
    const displayLength = displayBoxValues.length;
    
    // Calculate optimal bar width - make bars narrower as count increases
    let barWidth = 100 / displayLength;
    
    // Set minimum width for bars to ensure visibility and maximum width for aesthetics
    const minBarWidth = 0.2; // Percent
    const maxBarWidth = 2.0; // Percent
    barWidth = Math.max(minBarWidth, Math.min(barWidth, maxBarWidth));
    
    for (let i = 0; i < displayLength; i++) {
        if (displayBins[i] === 0) continue; // Skip empty bins
        
        // Create bar container
        const barContainer = document.createElement("div");
        barContainer.className = "histogram-bar-container";
        
        // Position the bar evenly across the available space
        const leftPosition = (i / displayLength) * 100;
        barContainer.style.left = `${leftPosition}%`;
        barContainer.style.width = `${barWidth}%`;
        
        // Create bar with height based on count
        const bar = document.createElement("div");
        bar.className = "histogram-bar";
        const scaledHeight = (displayBins[i] / maxCount) * 100;
        bar.style.height = `${scaledHeight}%`;
        
        // Add a tooltip with detailed information
        const boxValue = displayBoxValues[i];
        const count = displayBins[i];
        const percentage = (count / totalPeople) * 100;
        bar.title = `${boxValue} boxes: ${count} people (${percentage.toFixed(1)}%)`;
        
        barContainer.appendChild(bar);
        
        // Add bin label for selective bars - adjust frequency based on count
        const labelFrequency = Math.max(1, Math.ceil(displayLength / 40));
        if (i % labelFrequency === 0) {
            const binLabel = document.createElement("div");
            binLabel.className = "histogram-label";
            binLabel.textContent = displayLabels[i];
            barContainer.appendChild(binLabel);
        }
        
        barsDiv.appendChild(barContainer);
    }
    
    barsContainer.appendChild(barsDiv);
    chartContainer.appendChild(barsContainer);
    histDiv.appendChild(chartContainer);
    
    // Add a note about data representation
    const note = document.createElement("p");
    note.className = "histogram-note";
    note.textContent = `Showing all ${numBins} unique box counts. Hover over bars for details.`;
    histDiv.appendChild(note);
    
    container.appendChild(histDiv);
}




