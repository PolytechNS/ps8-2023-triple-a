echo "Starting Docker containers: Node and MongoDB"

echo "---------------------Server---------------------"
cd ./back/server
npm run server &
sleep 5
echo "--------------------BUILD----------------------"
docker-compose build

echo "---------------------UP------------------------"
docker-compose up 

echo "Stopping Docker containers: Node and MongoDB"
read -p "Press any key to quit ..."