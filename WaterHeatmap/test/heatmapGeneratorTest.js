const fs = require('fs');
const { createCanvas } = require('canvas');

function generateHeatmap() {
    const width = 3840;
    const height = 1810;
    const dotRadius = 5;
    const dotOpacity = 0.5;

    const gradientColors = [
        { temperature: -50, color: '#0505d0' },
        { temperature: -35, color: '#057aef' },
        { temperature: -30, color: '#23a9fd' },
        { temperature: -20, color: '#60d8ff' },
        { temperature: -10, color: '#33FFCC' },
        { temperature: 0, color: '#1fd31f' },
        { temperature: 5, color: '#00ff21' },
        { temperature: 10, color: '#69ff63' },
        { temperature: 15, color: '#efef16' },
        { temperature: 25, color: '#ffc900' },
        { temperature: 35, color: '#ee8f01' },
        { temperature: 45, color: '#f86201' },
        { temperature: 50, color: '#FF0000' }
    ];

    const canvas = createCanvas(width, height);
    const context = canvas.getContext('2d');

    function getTemperatureColor(temperature) {
        for (let i = 0; i < gradientColors.length - 1; i++) {
            const currentColor = gradientColors[i];
            const nextColor = gradientColors[i + 1];

            if (temperature >= currentColor.temperature && temperature <= nextColor.temperature) {
                const temperatureRange = nextColor.temperature - currentColor.temperature;
                const colorRange = {
                    red: parseInt(nextColor.color.slice(1, 3), 16) - parseInt(currentColor.color.slice(1, 3), 16),
                    green: parseInt(nextColor.color.slice(3, 5), 16) - parseInt(currentColor.color.slice(3, 5), 16),
                    blue: parseInt(nextColor.color.slice(5, 7), 16) - parseInt(currentColor.color.slice(5, 7), 16)
                };

                const temperatureDifference = temperature - currentColor.temperature;
                const color = {
                    red: Math.round((parseInt(currentColor.color.slice(1, 3), 16) + (temperatureDifference / temperatureRange) * colorRange.red)),
                    green: Math.round((parseInt(currentColor.color.slice(3, 5), 16) + (temperatureDifference / temperatureRange) * colorRange.green)),
                    blue: Math.round((parseInt(currentColor.color.slice(5, 7), 16) + (temperatureDifference / temperatureRange) * colorRange.blue))
                };

                return `rgba(${color.red}, ${color.green}, ${color.blue}, ${dotOpacity})`;
            }
        }

        return `rgba(${parseInt(gradientColors[gradientColors.length - 1].color.slice(1, 3), 16)}, ${parseInt(gradientColors[gradientColors.length - 1].color.slice(3, 5), 16)}, ${parseInt(gradientColors[gradientColors.length - 1].color.slice(5, 7), 16)}, ${dotOpacity})`;
    }

    function loadAndProcessData() {
        const currentDate = new Date();
        const currentDateString = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;

        let jsonData = null;
        let jsonDataPath = '';

        let heatmapFilePath = `./test/temp/heatmap_${currentDateString}.png`;

        try {
            fs.accessSync(heatmapFilePath, fs.constants.F_OK);
            console.log(`File ${heatmapFilePath} found.`);
        } catch (error) {
            console.log(`File ${heatmapFilePath} not found.`);

            jsonDataPath = `./test/temp/compressed_${currentDateString}.json`;

            try {
                fs.accessSync(jsonDataPath, fs.constants.F_OK);
                console.log(`File ${jsonDataPath} found.`);
                jsonData = JSON.parse(fs.readFileSync(jsonDataPath, 'utf-8'));
            } catch (error) {
                console.log(`File ${jsonDataPath} not found.`);

                jsonDataPath = './test/temp/compressed.json';

                try {
                    fs.accessSync(jsonDataPath, fs.constants.F_OK);
                    console.log(`File ${jsonDataPath} found.`);
                    jsonData = JSON.parse(fs.readFileSync(jsonDataPath, 'utf-8'));
                } catch (error) {
                    console.log(`File ${jsonDataPath} not found.`);
                }
            }
        }

        if (jsonData) {
            for (let i = 0; i < jsonData.length; i++) {
                const item = jsonData[i];
                const x = Math.round((item.x / 36000) * width);
                const y = Math.round((item.y / 18000) * height);
                const temperature = item.value;

                const color = getTemperatureColor(temperature);
                context.fillStyle = color;
                context.beginPath();
                context.arc(x, y, dotRadius, 0, 2 * Math.PI);
                context.closePath();
                context.fill();
            }

            const pngBuffer = canvas.toBuffer();
            let heatmapFilename = 'heatmap.png';

            if (jsonDataPath.includes(currentDateString)) {
                heatmapFilename = `heatmap_${currentDateString}.png`;
            }

            fs.writeFileSync(`./test/temp/${heatmapFilename}`, pngBuffer);
            console.log(`Heatmap saved to ${heatmapFilename}`);
        } else {
            console.log(`Heatmap not generated.`);
        }
    }

    loadAndProcessData();
}

module.exports = {
    generateHeatmap: generateHeatmap
};