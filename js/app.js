/**
 * Main Application Module
 * Contains core application logic and data processing
 */

function renderFilteredLists() {
    const filter = document.getElementById('iconic_filter').value;
    
    // Sort function: invasive first, then horizon scan, then all others
    const sortByPriority = (a, b) => {
        const aIsInvasive = a.html.includes('badge-danger');
        const bIsInvasive = b.html.includes('badge-danger');
        const aIsHorizon = a.html.includes('Horizon Scan 2025') || a.html.includes('Horizon Scan 2019');
        const bIsHorizon = b.html.includes('Horizon Scan 2025') || b.html.includes('Horizon Scan 2019');

        if (aIsInvasive && !bIsInvasive) return -1;
        if (!aIsInvasive && bIsInvasive) return 1;

        if (aIsHorizon && !bIsHorizon) return -1;
        if (!aIsHorizon && bIsHorizon) return 1;

        return 0;
    };
    
    const filteredRecordedItems = recordedItems
        .filter(it => (!filter || !it.iconic || it.iconic === filter));
    const filteredMissingItems = missingItems
        .filter(it => (!filter || !it.iconic || it.iconic === filter));

    let recHtml = filteredRecordedItems
        .sort(sortByPriority)
        .map(it => it.html)
        .join('');
    let missHtml = filteredMissingItems
        .sort(sortByPriority)
        .map(it => it.html)
        .join('');
    
    let containerRecorded = document.querySelector('.species_list_recorded');
    let containerMissing = document.querySelector('.species_list');
    
    if (containerRecorded) {
        containerRecorded.innerHTML = recHtml || '<p>No recorded species for this filter.</p>';
    }
    if (containerMissing) {
        containerMissing.innerHTML = missHtml || '<p>No missing species for this filter.</p>';
    }
    
    // Update tab badges with count summaries for the currently displayed filter
    updateTabBadges(filteredRecordedItems, filteredMissingItems);
}

function updateTabBadges(filteredRecordedItems, filteredMissingItems) {
    // Count invasive species in recorded items (Locally recorded species tab)
    const recordedInvasiveCount = filteredRecordedItems.filter(item => 
        item.html.includes('badge-danger')
    ).length;

    // Count 2025/2019 horizon scan matches in recorded items
    const recordedHorizonCount = filteredRecordedItems.filter(item =>
        item.html.includes('Horizon Scan 2025') || item.html.includes('Horizon Scan 2019')
    ).length;
    
    // Count invasive species in missing items (Proximity recorded species tab)
    const missingInvasiveCount = filteredMissingItems.filter(item => 
        item.html.includes('badge-danger')
    ).length;

    // Count 2025/2019 horizon scan matches in missing items
    const missingHorizonCount = filteredMissingItems.filter(item =>
        item.html.includes('Horizon Scan 2025') || item.html.includes('Horizon Scan 2019')
    ).length;
    
    // Update the "Locally recorded species" tab (profile-tab)
    const profileTab = document.getElementById('profile-tab');
    if (profileTab) {
        const h6 = profileTab.querySelector('h6');
        if (h6) {
            // Remove existing badges
            h6.querySelectorAll('.invasive-count-badge, .horizon-count-badge').forEach(el => el.remove());
            
            // Add invasive badge if count > 0
            if (recordedInvasiveCount > 0) {
                const badge = document.createElement('span');
                badge.className = 'badge bg-danger invasive-count-badge';
                badge.style.marginLeft = '6px';
                badge.style.fontSize = '0.7em';
                badge.textContent = recordedInvasiveCount;
                h6.appendChild(badge);
            }

            // Add horizon-scan badge if count > 0
            if (recordedHorizonCount > 0) {
                const horizonBadge = document.createElement('span');
                horizonBadge.className = 'badge horizon-count-badge';
                horizonBadge.style.marginLeft = '6px';
                horizonBadge.style.fontSize = '0.7em';
                horizonBadge.style.backgroundColor = '#ffc107';
                horizonBadge.style.color = '#1E513D';
                horizonBadge.title = 'Number of species matching Horizon Scan 2025/2019';
                horizonBadge.textContent = recordedHorizonCount;
                h6.appendChild(horizonBadge);
            }
        }
    }
    
    // Update the "Proximity recorded species" tab (home-tab)
    const homeTab = document.getElementById('home-tab');
    if (homeTab) {
        const h6 = homeTab.querySelector('h6');
        if (h6) {
            // Remove existing badges
            h6.querySelectorAll('.invasive-count-badge, .horizon-count-badge').forEach(el => el.remove());
            
            // Add invasive badge if count > 0
            if (missingInvasiveCount > 0) {
                const badge = document.createElement('span');
                badge.className = 'badge bg-danger invasive-count-badge';
                badge.style.marginLeft = '6px';
                badge.style.fontSize = '0.7em';
                badge.textContent = missingInvasiveCount;
                h6.appendChild(badge);
            }

            // Add horizon-scan badge if count > 0
            if (missingHorizonCount > 0) {
                const horizonBadge = document.createElement('span');
                horizonBadge.className = 'badge horizon-count-badge';
                horizonBadge.style.marginLeft = '6px';
                horizonBadge.style.fontSize = '0.7em';
                horizonBadge.style.backgroundColor = '#ffc107';
                horizonBadge.style.color = '#1E513D';
                horizonBadge.title = 'Number of species matching Horizon Scan 2025/2019';
                horizonBadge.textContent = missingHorizonCount;
                h6.appendChild(horizonBadge);
            }
        }
    }
}
