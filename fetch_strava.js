const fs = require('fs');

async function getStravaData() {
    const clientId = process.env.STRAVA_CLIENT_ID;
    const clientSecret = process.env.STRAVA_CLIENT_SECRET;
    const refreshToken = process.env.STRAVA_REFRESH_TOKEN;

    if (!clientId || !clientSecret || !refreshToken) {
        console.error("Missing Strava API credentials!");
        process.exit(1);
    }

    try {
        // 1. Authenticate with Strava to get a fresh Access Token
        const tokenResponse = await fetch('https://www.strava.com/api/v3/oauth/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                client_id: clientId,
                client_secret: clientSecret,
                refresh_token: refreshToken,
                grant_type: 'refresh_token'
            })
        });
        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;

        console.log("Successfully fetched Access Token.");

        // 2. Fetch the last 52 weeks of activities
        let activities = [];
        let page = 1;
        // Calculate 52 weeks ago (buffer of a few extra days to be safe)
        const oneYearAgo = Math.floor((Date.now() - (53 * 7 * 24 * 60 * 60 * 1000)) / 1000);

        while (true) {
            const res = await fetch(`https://www.strava.com/api/v3/athlete/activities?after=${oneYearAgo}&per_page=200&page=${page}`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            const data = await res.json();
            
            if (data.length === 0 || data.errors) {
                if(data.errors) console.error("Strava API Error:", data.errors);
                break;
            }
            activities.push(...data);
            page++;
        }

        console.log(`Total activities fetched from Strava: ${activities.length}`);

        // 3. Bucket activities into 52 weeks
        const weeks = Array(52).fill(0);
        const now = new Date();
        now.setHours(23, 59, 59, 999); // Normalize to end of today

        let runCount = 0;

        activities.forEach(activity => {
            // Broaden the filter to catch variations of "Run"
            const actType = activity.type ? activity.type.toLowerCase() : '';
            const sportType = activity.sport_type ? activity.sport_type.toLowerCase() : '';
            
            if (actType.includes('run') || sportType.includes('run')) {
                runCount++;
                const activityDate = new Date(activity.start_date);
                const diffTime = now.getTime() - activityDate.getTime();
                const diffDays = diffTime / (1000 * 60 * 60 * 24);
                const weeksAgo = Math.floor(diffDays / 7);
                
                if (weeksAgo >= 0 && weeksAgo < 52) {
                    const index = 51 - weeksAgo; // 51 is current week
                    weeks[index] += activity.distance / 1000; // Convert meters to km
                }
            }
        });

        console.log(`Total 'Run' activities processed: ${runCount}`);

        // Round all numbers to 1 decimal place
        const roundedWeeks = weeks.map(w => Math.round(w * 10) / 10);

        // Save data to JSON file
        fs.writeFileSync('strava_data.json', JSON.stringify(roundedWeeks));
        console.log("Successfully generated strava_data.json!");

    } catch (error) {
        console.error("Error fetching Strava data:", error);
        process.exit(1);
    }
}

getStravaData();
