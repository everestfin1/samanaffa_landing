import * as fs from 'fs';

interface Commune {
  name: string;
  type: 'commune' | 'communaute_rurale';
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

function parseSenegalCSV(content: string): Region[] {
  const lines = content.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  const regions: Region[] = [];

  let currentRegion: Region | null = null;
  let currentDepartement: Departement | null = null;
  let currentArrondissement: Arrondissement | null = null;

  for (const line of lines) {
    // CSV format: ,,CONTENT - we need the third column
    const parts = line.split(',');
    if (parts.length < 3) continue;

    const content = parts[2].trim();
    if (!content) continue;

    // Handle regions - lines that start with "REGION"
    if (content.startsWith('REGION')) {
      // Extract region name - take everything after "REGION"
      const regionName = content.replace('REGION', '').trim();
      // Clean up region name - remove extra text and "DE " prefix
      const cleanRegionName = regionName
        .replace(/\s*(ZONE URBAINE|ZONE RURALE|POPU\. URBAINE|POPU\. RURALE|POP\. URBAINE|POP\. RURALE|URBAIN|RURAL| URBAIN| RURAL)\s*$/, '')
        .replace(/^DE\s+/, '');
      currentRegion = {
        name: cleanRegionName,
        departements: []
      };
      regions.push(currentRegion);
      currentDepartement = null;
      currentArrondissement = null;
    }
    // Handle departments - lines that start with "DEPARTEMENT"
    else if (content.includes('DEPARTEMENT')) {
      if (!currentRegion) continue;

      // Extract department name - take everything after "DEPARTEMENT"
      const deptName = content.replace(/DEPARTEMENT\s*/, '').trim();
      // Clean up department name - remove "DE " prefix if present
      const cleanDeptName = deptName.replace(/^DE\s+/, '');
      currentDepartement = {
        name: cleanDeptName,
        arrondissements: []
      };
      currentRegion.departements.push(currentDepartement);
      currentArrondissement = null;
    }
    // Handle arrondissements - lines that contain "ARRONDISSEMENT" or "ARRONDISSEMNT"
    else if (content.includes('ARRONDISSEMENT') || content.includes('ARRONDISSEMNT') || content.includes('ARONDISSEMENT') || content.includes('AR.RONDISSEMENT')) {
      if (!currentDepartement) continue;

      // Extract arrondissement name - take everything after the keyword
      const arrName = content
        .replace(/(ARRONDISSEMENT|ARRONDISSEMNT|ARONDISSEMENT|AR\.RONDISSEMENT)\s*/, '')
        .trim();
      currentArrondissement = {
        name: arrName,
        communes: []
      };
      currentDepartement.arrondissements.push(currentArrondissement);
    }
    // Handle communes - lines that start with "COM. ", "CR. ", or "CA. "
    else if (content.startsWith('COM. ') || content.startsWith('CR. ') || content.startsWith('CA. ')) {
      if (!currentArrondissement) continue;

      let type: 'commune' | 'communaute_rurale';
      let communeName: string;

      if (content.startsWith('COM. ')) {
        type = 'commune';
        communeName = content.replace('COM. ', '');
      } else if (content.startsWith('CR. ')) {
        type = 'communaute_rurale';
        communeName = content.replace('CR. ', '');
      } else {
        type = 'commune'; // CA. are communes d'arrondissement
        communeName = content.replace('CA. ', '');
      }

      currentArrondissement.communes.push({
        name: communeName,
        type: type
      });
    }
    // Handle commune lines that start directly with "Commune" (like "Commune de BAMBEY")
    else if (content.startsWith('Commune ')) {
      if (!currentArrondissement) continue;

      const communeName = content.replace('Commune ', '');
      currentArrondissement.communes.push({
        name: communeName,
        type: 'commune'
      });
    }
  }

  return regions;
}

// Read the CSV file
const content = fs.readFileSync('project_docs/Liste administrative Senegal.csv', 'utf-8');

// Parse the data
const regions = parseSenegalCSV(content);

// Write to JSON file
fs.writeFileSync('regions_senegal.json', JSON.stringify(regions, null, 2));

console.log('Parsed Senegal administrative divisions CSV and saved to regions_senegal.json');
console.log(`Found ${regions.length} regions`);
