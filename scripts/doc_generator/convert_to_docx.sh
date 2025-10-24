#!/bin/bash

# Script de conversion Markdown vers DOCX
# Utilise Pandoc pour générer des documents Word professionnels
# Usage: ./convert_to_docx.sh

set -e  # Exit on error

# Couleurs pour output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Conversion Markdown → DOCX${NC}"
echo -e "${BLUE}  Everest Finance - Documentation${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Vérifier si Pandoc est installé
if ! command -v pandoc &> /dev/null; then
    echo -e "${RED}❌ Erreur: Pandoc n'est pas installé${NC}"
    echo -e "\nPour installer Pandoc:"
    echo -e "  macOS:    ${GREEN}brew install pandoc${NC}"
    echo -e "  Ubuntu:   ${GREEN}sudo apt-get install pandoc${NC}"
    echo -e "  Windows:  Télécharger depuis https://pandoc.org/installing.html"
    exit 1
fi

echo -e "${GREEN}✓ Pandoc trouvé: $(pandoc --version | head -n 1)${NC}\n"

# Répertoires
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
DOCS_DIR="$PROJECT_ROOT/project_docs/generated"

cd "$DOCS_DIR"

echo -e "${BLUE}Répertoire de travail: ${NC}$DOCS_DIR\n"

# Fonction de conversion
convert_document() {
    local input_file=$1
    local output_file="${input_file%.md}.docx"
    
    echo -e "${BLUE}📄 Conversion: ${NC}$input_file"
    
    pandoc "$input_file" -o "$output_file" \
        --toc \
        --toc-depth=2 \
        --number-sections \
        --highlight-style=tango \
        --metadata title="Everest Finance - $(basename "$input_file" .md)" \
        --metadata author="Développeur Solo" \
        --metadata date="24 Octobre 2025"
    
    if [ $? -eq 0 ]; then
        local size=$(du -h "$output_file" | cut -f1)
        echo -e "  ${GREEN}✓ Créé: ${NC}$output_file ${GREEN}($size)${NC}\n"
    else
        echo -e "  ${RED}✗ Erreur lors de la conversion${NC}\n"
        return 1
    fi
}

# Convertir les trois documents
echo -e "${BLUE}=== Conversion des documents ===${NC}\n"

# Document 1: Aperçu Technique
if [ -f "01_APERCU_TECHNIQUE.md" ]; then
    convert_document "01_APERCU_TECHNIQUE.md"
else
    echo -e "${RED}❌ Fichier non trouvé: 01_APERCU_TECHNIQUE.md${NC}\n"
fi

# Document 2: Progrès Développement
if [ -f "02_PROGRES_DEVELOPPEMENT.md" ]; then
    convert_document "02_PROGRES_DEVELOPPEMENT.md"
else
    echo -e "${RED}❌ Fichier non trouvé: 02_PROGRES_DEVELOPPEMENT.md${NC}\n"
fi

# Document 3: Contexte Business
if [ -f "03_CONTEXTE_BUSINESS.md" ]; then
    convert_document "03_CONTEXTE_BUSINESS.md"
else
    echo -e "${RED}❌ Fichier non trouvé: 03_CONTEXTE_BUSINESS.md${NC}\n"
fi

# Résumé
echo -e "${BLUE}=== Résumé ===${NC}"
echo -e "\n${GREEN}✓ Conversion terminée${NC}"
echo -e "\nFichiers générés dans:"
echo -e "  ${BLUE}$DOCS_DIR${NC}\n"

# Lister les fichiers .docx créés
echo -e "Fichiers .docx:"
for file in *.docx; do
    if [ -f "$file" ]; then
        size=$(du -h "$file" | cut -f1)
        echo -e "  📄 $file ${GREEN}($size)${NC}"
    fi
done

echo -e "\n${GREEN}🎉 Tous les documents sont prêts!${NC}"
echo -e "\nProchaines étapes:"
echo -e "  1. Ouvrir les fichiers .docx dans Microsoft Word ou LibreOffice"
echo -e "  2. Ajuster le formatage si nécessaire (logos, couleurs, etc.)"
echo -e "  3. Ajouter page de garde personnalisée"
echo -e "  4. Régénérer table des matières si modifié"
echo -e "  5. Exporter en PDF pour distribution finale\n"

