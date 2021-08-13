# Create open-tacos container
docker build . -f "open-tacos.dockerfile" -t open-tacos
docker run -itd --name open-tacos -v ${pwd}:/data open-tacos