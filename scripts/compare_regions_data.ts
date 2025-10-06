import fs from 'fs';
import path from 'path';

interface Commune {
  name: string;
  type: string;
}

interface Arrondissement {
  name: string;
  communes: Commune[];
}

interface Departement {
  name: string;
  arrondissements: Arrondissement[];
}

interface Region {
  name: string;
  departements: Departement[];
}

// Read and parse CSV data
function parseCSVData(): Region[] {
  const csvPath = path.join(process.cwd(), 'project_docs/Liste administrative Senegal.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const lines = csvContent.split('\n');
  
  const regions: Region[] = [];
  let currentRegion: Region | null = null;
  let currentDepartement: Departement | null = null;
  let currentArrondissement: Arrondissement | null = null;
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith(',,PROJECTION') || trimmedLine.startsWith(',,NOM LOCALITE')) {
      continue;
    }
    
    const parts = trimmedLine.split(',');
    if (parts.length < 3) continue;
    
    const content = parts[2].trim();
    
    // Skip empty content or headers
    if (!content || content === 'ZONE URBAINE' || content === 'ZONE RURALE' || 
        content === 'POP. URBAINE' || content === 'POP. RURALE' || 
        content === 'URBAIN' || content === 'RURAL' || content === 'POPU. URBAINE' || content === 'POPU. RURALE') {
      continue;
    }
    
    // Check if it's a region
    if (content.startsWith('REGION')) {
      const regionName = content.replace('REGION ', '').replace('REGION DE ', '').replace('REGION  ', '').trim();
      currentRegion = {
        name: regionName,
        departements: []
      };
      regions.push(currentRegion);
      currentDepartement = null;
      currentArrondissement = null;
    }
    // Check if it's a departement
    else if (content.startsWith('DEPARTEMENT')) {
      if (currentRegion) {
        const deptName = content.replace('DEPARTEMENT ', '').replace('DEPARTEMENT  ', '').replace('DEPARTEMENT   ', '').trim();
        currentDepartement = {
          name: deptName,
          arrondissements: []
        };
        currentRegion.departements.push(currentDepartement);
        currentArrondissement = null;
      }
    }
    // Check if it's an arrondissement
    else if (content.startsWith('ARRONDISSEMENT') || content.startsWith('ARONDISSEMENT') || content.startsWith('AR.RONDISSEMENT') || content.startsWith('ARRONDISSEMNT') || content.startsWith('ARRONDISSEMN')) {
      if (currentDepartement) {
        const arrName = content
          .replace('ARRONDISSEMENT ', '')
          .replace('ARRONDISSEMENT  ', '')
          .replace('ARONDISSEMENT ', '')
          .replace('AR.RONDISSEMENT ', '')
          .replace('ARRONDISSEMNT ', '')
          .replace('ARRONDISSEMN ', '')
          .trim();
        currentArrondissement = {
          name: arrName,
          communes: []
        };
        currentDepartement.arrondissements.push(currentArrondissement);
      }
    }
    // Check if it's a commune
    else if (content.startsWith('CA.') || content.startsWith('CR.') || content.startsWith('COM.') || content.startsWith('COM ')) {
      if (currentArrondissement) {
        let communeName = '';
        let communeType = '';
        
        if (content.startsWith('CA.')) {
          communeName = content.replace('CA.', '').trim();
          communeType = 'commune';
        } else if (content.startsWith('CR.')) {
          communeName = content.replace('CR.', '').trim();
          communeType = 'communaute_rurale';
        } else if (content.startsWith('COM.') || content.startsWith('COM ')) {
          communeName = content.replace('COM.', '').replace('COM ', '').trim();
          communeType = 'commune';
        }
        
        if (communeName) {
          currentArrondissement.communes.push({
            name: communeName,
            type: communeType
          });
        }
      }
    }
    // Handle communes that are directly under departement (like "Commune de BAMBEY")
    else if (content.startsWith('Commune de ') || content.startsWith('Commune ')) {
      if (currentDepartement && !currentArrondissement) {
        // This is a commune directly under a departement, we need to create a default arrondissement
        const communeName = content.replace('Commune de ', '').replace('Commune ', '').trim();
        
        // Check if we already have an arrondissement with the same name as the commune
        let existingArr = currentDepartement.arrondissements.find(arr => arr.name === communeName);
        if (!existingArr) {
          existingArr = {
            name: communeName,
            communes: []
          };
          currentDepartement.arrondissements.push(existingArr);
        }
        
        existingArr.communes.push({
          name: communeName,
          type: 'commune'
        });
      }
    }
  }
  
  return regions;
}

// Read existing JSON data
function readJSONData(): Region[] {
  const jsonPath = path.join(process.cwd(), 'regions_senegal.json');
  const jsonContent = fs.readFileSync(jsonPath, 'utf-8');
  return JSON.parse(jsonContent);
}

// Compare and find missing data
function compareData() {
  console.log('Parsing CSV data...');
  const csvData = parseCSVData();
  
  console.log('Reading JSON data...');
  const jsonData = readJSONData();
  
  console.log('\n=== COMPARISON RESULTS ===\n');
  
  console.log(`CSV Regions: ${csvData.length}`);
  console.log(`JSON Regions: ${jsonData.length}`);
  
  // Compare regions
  for (const csvRegion of csvData) {
    const jsonRegion = jsonData.find(r => r.name === csvRegion.name);
    
    if (!jsonRegion) {
      console.log(`❌ Missing region: ${csvRegion.name}`);
      continue;
    }
    
    console.log(`\n📍 Region: ${csvRegion.name}`);
    console.log(`   CSV Departements: ${csvRegion.departements.length}, JSON Departements: ${jsonRegion.departements.length}`);
    
    // Compare departements
    for (const csvDept of csvRegion.departements) {
      const jsonDept = jsonRegion.departements.find(d => d.name === csvDept.name);
      
      if (!jsonDept) {
        console.log(`   ❌ Missing departement: ${csvDept.name}`);
        continue;
      }
      
      console.log(`   🏛️  Departement: ${csvDept.name}`);
      console.log(`      CSV Arrondissements: ${csvDept.arrondissements.length}, JSON Arrondissements: ${jsonDept.arrondissements.length}`);
      
      // Compare arrondissements
      for (const csvArr of csvDept.arrondissements) {
        const jsonArr = jsonDept.arrondissements.find(a => a.name === csvArr.name);
        
        if (!jsonArr) {
          console.log(`      ❌ Missing arrondissement: ${csvArr.name}`);
          continue;
        }
        
        console.log(`      🏘️  Arrondissement: ${csvArr.name}`);
        console.log(`         CSV Communes: ${csvArr.communes.length}, JSON Communes: ${jsonArr.communes.length}`);
        
        // Compare communes
        if (csvArr.communes.length > jsonArr.communes.length) {
          console.log(`         ⚠️  Missing communes in ${csvArr.name}:`);
          for (const csvCommune of csvArr.communes) {
            const jsonCommune = jsonArr.communes.find(c => c.name === csvCommune.name);
            if (!jsonCommune) {
              console.log(`            - ${csvCommune.name} (${csvCommune.type})`);
            }
          }
        }
      }
    }
  }
  
  return { csvData, jsonData };
}

// Generate complete JSON structure
function generateCompleteJSON() {
  const { csvData } = compareData();
  
  console.log('\n=== GENERATING COMPLETE JSON ===\n');
  
  const completeJsonPath = path.join(process.cwd(), 'regions_senegal_complete.json');
  fs.writeFileSync(completeJsonPath, JSON.stringify(csvData, null, 2));
  
  console.log(`✅ Complete JSON saved to: ${completeJsonPath}`);
  
  return csvData;
}

// Run the comparison
if (require.main === module) {
  generateCompleteJSON();
}

export { parseCSVData, readJSONData, compareData, generateCompleteJSON };
