cd /mnt/c/Users/Arun\ Joseph/Documents/blueberryhills/blueberry-hms

# Replace YOUR_TOKEN with the actual token you received
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0ZDFjNjkwZi05MTlkLTQwMzYtYmJkMy0wOTJjYzU4YTkwNjUiLCJlbWFpbCI6Im1hbmFnZXJAYmx1ZWJlcnJ5aGlsbHNtdW5uYXIuaW4iLCJyb2xlIjoiTUFOQUdFUiIsImlhdCI6MTc3MzY1MzAxMiwiZXhwIjoxNzc0MjU3ODEyfQ.38LWhv7haQjTuGNeVBLN7KmxR7oVIaXtt63OFVhwXHM"

# Test 1: Get your profile
echo "1️⃣ Testing /auth/me"
curl http://localhost:4000/api/v1/auth/me \
  -H "Authorization: Bearer $TOKEN"

echo -e "\n\n"

# Test 2: Get all rooms
echo "2️⃣ Testing /rooms"
curl http://localhost:4000/api/v1/rooms \
  -H "Authorization: Bearer $TOKEN"

echo -e "\n\n"

# Test 3: Get all guests
echo "3️⃣ Testing /guests"
curl http://localhost:4000/api/v1/guests \
  -H "Authorization: Bearer $TOKEN"

echo -e "\n\n"

# Test 4: Get all bookings
echo "4️⃣ Testing /bookings"
curl http://localhost:4000/api/v1/bookings \
  -H "Authorization: Bearer $TOKEN"