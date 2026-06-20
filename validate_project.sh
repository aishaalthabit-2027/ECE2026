#!/bin/bash
echo "Validating Early Education Licensing iOS App Project"
echo "=================================================="

# Check if essential files exist
FILES_TO_CHECK=(
    "EarlyEducationLicensingAppApp.swift"
    "ContentView.swift"
    "AppDelegate.swift"
    "Info.plist"
    "Bridge.js"
    "ECEDataManager.swift"
    "ECEFileManagerHelper.swift"
    "\u{0646}\u{0638}\u{0627}\u{0645} \u{062a}\u{0631}\u{0627}\u{0648}\u{0636} \u{0627}\u{0644}\u{062a}\u{0631}\u{064a}\u{0636} \u{0627}\u{0644}\u{0645}\u{0628}\u{0643}\u{0631.dc.html"
    "seed-data.js"
    "ece-store.js"
    "support.js"
)

all_good=true
for file in "${FILES_TO_CHECK[@]}"; do
    if [ -f "/Users/aishaalthabit/EarlyEducationLicensingApp/$file" ]; then
        echo "✓ $file found"
    else
        echo "✗ $file MISSING"
        all_good=false
    fi
done

echo ""
if [ "$all_good" = true ]; then
    echo "All essential files are present!"
    echo "Project structure looks good for initial development."
else
    echo "Some files are missing. Please check the output above."
fi

# Check HTML file size
HTML_FILE="/Users/aishaalthabit/EarlyEducationLicensingApp/\u{0646}\u{0638}\u{0627}\u{0645} \u{062a}\u{0631}\u{0627}\u{0648}\u{0636} \u{0627}\u{0644}\u{062a}\u{0631}\u{064a}\u{0636} \u{0627}\u{0644}\u{0645}\u{0628}\u{0643}\u{0631.dc.html"
if [ -f "$HTML_FILE" ]; then
    SIZE=$(wc -c < "$HTML_FILE")
    echo "Main HTML file size: $SIZE bytes"
fi

echo ""
echo "Next steps:"
echo "1. Open the project in Xcode"
echo "2. Build and run on simulator or device"
echo "3. Test the dashboard functionality"
echo "4. Verify file upload/download works"
echo "5. Check that Arabic text displays correctly (RTL)"

