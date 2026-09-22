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
        
        if (tokenData.errors || !tokenData.access_token) {
            console.error("Failed to authenticate with Strava:", tokenData);
            process.exit(1);
        }
        
        const accessToken = tokenData.access_token;
        console.log("Successfully authenticated with Strava!");

        // 2. Fetch the last 52 weeks of activities
        let activities = [];
        let page = 1;
        const oneYearAgo = Math.floor((Date.now() - (52 * 7 * 24 * 60 * 60 * 1000)) / 1000);

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

        // 3. Bucket activities into 52 weeks (Aligned to Monday-Sunday)
        const weeks = Array(52).fill(0);
        
        // Find the most recent Sunday at 11:59:59 PM
        const today = new Date();
        const dayOfWeek = today.getDay(); // 0 (Sun) to 6 (Sat)
        // If today is Sunday (0), daysToSunday is 0. Otherwise, it's 7 - dayOfWeek.
        const daysToSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
        
        const endOfCurrentWeek = new Date(today);
        endOfCurrentWeek.setDate(today.getDate() + daysToSunday);
        endOfCurrentWeek.setHours(23, 59, 59, 999);

        let runCount = 0;

        activities.forEach(activity => {
            const actType = activity.type ? activity.type.toLowerCase() : '';
            const sportType = activity.sport_type ? activity.sport_type.toLowerCase() : '';
            
            // Only process Runs
            if (actType.includes('run') || sportType.includes('run')) {
                runCount++;
                const activityDate = new Date(activity.start_date);
                
                // Calculate difference in milliseconds from the end of the current week (Sunday)
                const diffTime = endOfCurrentWeek.getTime() - activityDate.getTime();
                
                // Convert to weeks (1 week = 1000 * 60 * 60 * 24 * 7 ms)
                const weeksAgo = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
                
                // If it happened within the last 52 weeks, add it to the correct bucket
                if (weeksAgo >= 0 && weeksAgo < 52) {
                    const index = 51 - weeksAgo; // 51 is the current week bucket
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
