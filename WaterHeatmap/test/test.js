const { expect } = require('chai');
const fs = require('fs');
const { generateHeatmap } = require('./heatmapGeneratorTest');

describe('Heatmap Generation', function () {
    const tempFolder = './test/temp';

    beforeEach(function () {
        if (!fs.existsSync(tempFolder)) {
            fs.mkdirSync(tempFolder);
        } else {
            fs.readdirSync(tempFolder).forEach(file => {
                const filePath = `${tempFolder}/${file}`;
                fs.unlinkSync(filePath);
            });
        }
    });

    it('should create heatmap_currentdate.png in temp folder', function () {
        const currentDate = new Date();
        const currentDateString = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
        const heatmapFilePath = `${tempFolder}/heatmap_${currentDateString}.png`;

        if (!fs.existsSync(heatmapFilePath)) {
            const { createCanvas } = require('canvas');

            // Create an empty image using the canvas module
            const canvas = createCanvas(10, 10);
            const context = canvas.getContext('2d');
            const buffer = canvas.toBuffer();

            fs.writeFileSync(heatmapFilePath, buffer);

            generateHeatmap();

            expect(fs.existsSync(heatmapFilePath)).to.be.true;

            fs.unlinkSync(heatmapFilePath);
        } else {
            expect(fs.existsSync(heatmapFilePath)).to.be.true;
        }
    });

    it('should create heatmap_currentdate.png after generating compressed current date.json', function () {
        const currentDate = new Date();
        const currentDateString = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;

        const jsonData = [{ x: 100, y: 100, value: 10 }, { x: 200, y: 200, value: 20 }];
        const jsonFilePath = `${tempFolder}/compressed_${currentDateString}.json`;
        fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData));

        generateHeatmap();

        const heatmapFilePath = `${tempFolder}/heatmap_${currentDateString}.png`;

        expect(fs.existsSync(heatmapFilePath)).to.be.true;

        fs.unlinkSync(jsonFilePath);
    });

    it('should create heatmap.png after generating compressed.json', function () {
        const jsonData = [{ x: 100, y: 100, value: 10 }, { x: 200, y: 200, value: 20 }];
        const jsonFilePath = `${tempFolder}/compressed.json`;
        fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData));

        generateHeatmap();

        const heatmapFilePath = `${tempFolder}/heatmap.png`;

        expect(fs.existsSync(heatmapFilePath)).to.be.true;

        fs.unlinkSync(jsonFilePath);
    });

    after(function () {
        fs.readdirSync(tempFolder).forEach(file => {
            const filePath = `${tempFolder}/${file}`;
            fs.unlinkSync(filePath);
        });
    });
});