# PowerShell script to update HTML files with SEO-friendly URLs
# This script removes .html extensions from all internal links

$files = @(
    "e:\DEVPY WEB\devpy\public\contact.html",
    "e:\DEVPY WEB\devpy\public\database-solutions.html", 
    "e:\DEVPY WEB\devpy\public\legal.html",
    "e:\DEVPY WEB\devpy\public\devops-automation.html",
    "e:\DEVPY WEB\devpy\public\cloud-solutions.html",
    "e:\DEVPY WEB\devpy\public\api-development.html",
    "e:\DEVPY WEB\devpy\public\404.html",
    "e:\DEVPY WEB\devpy\public\web-development.html",
    "e:\DEVPY WEB\devpy\public\services.html"
)

# URL mappings for clean URLs
$urlMappings = @{
    'href="index.html"' = 'href="/"'
    'href="about.html"' = 'href="/about"'
    'href="services.html"' = 'href="/services"'
    'href="contact.html"' = 'href="/contact"'
    'href="legal.html"' = 'href="/legal"'
    'href="web-development.html"' = 'href="/web-development"'
    'href="ai-projects.html"' = 'href="/ai-projects"'
    'href="cloud-solutions.html"' = 'href="/cloud-solutions"'
    'href="database-solutions.html"' = 'href="/database-solutions"'
    'href="devops-automation.html"' = 'href="/devops-automation"'
    'href="api-development.html"' = 'href="/api-development"'
    'href="404.html"' = 'href="/404"'
    'href="/services.html"' = 'href="/services"'
    'href="/contact.html"' = 'href="/contact"'
}

# Canonical URL mappings
$canonicalMappings = @{
    'rel="canonical" href="https://www.devpy.tech/contact.html"' = 'rel="canonical" href="https://www.devpy.tech/contact"'
    'rel="canonical" href="https://www.devpy.tech/services.html"' = 'rel="canonical" href="https://www.devpy.tech/services"'
    'rel="canonical" href="https://www.devpy.tech/legal.html"' = 'rel="canonical" href="https://www.devpy.tech/legal"'
    'rel="canonical" href="https://www.devpy.tech/web-development.html"' = 'rel="canonical" href="https://www.devpy.tech/web-development"'
    'rel="canonical" href="https://www.devpy.tech/cloud-solutions.html"' = 'rel="canonical" href="https://www.devpy.tech/cloud-solutions"'
    'rel="canonical" href="https://www.devpy.tech/database-solutions.html"' = 'rel="canonical" href="https://www.devpy.tech/database-solutions"'
    'rel="canonical" href="https://www.devpy.tech/devops-automation.html"' = 'rel="canonical" href="https://www.devpy.tech/devops-automation"'
    'rel="canonical" href="https://www.devpy.tech/api-development.html"' = 'rel="canonical" href="https://www.devpy.tech/api-development"'
}

Write-Host "Starting SEO URL cleanup for DevPy website..." -ForegroundColor Green

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "Processing: $file" -ForegroundColor Yellow
        
        # Read file content
        $content = Get-Content $file -Raw
        
        # Apply URL mappings
        foreach ($mapping in $urlMappings.GetEnumerator()) {
            $content = $content -replace [regex]::Escape($mapping.Key), $mapping.Value
        }
        
        # Apply canonical URL mappings
        foreach ($mapping in $canonicalMappings.GetEnumerator()) {
            $content = $content -replace [regex]::Escape($mapping.Key), $mapping.Value
        }
        
        # Write updated content back to file
        Set-Content $file -Value $content -NoNewline
        
        Write-Host "✓ Updated: $file" -ForegroundColor Green
    } else {
        Write-Host "✗ File not found: $file" -ForegroundColor Red
    }
}

Write-Host "`nSEO URL cleanup completed!" -ForegroundColor Green
Write-Host "All internal links now use clean URLs without .html extensions." -ForegroundColor Cyan
