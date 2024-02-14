const fileinput = document.querySelector(".file-input"),
filterOptions = document.querySelectorAll(".filter button"),
filterName = document.querySelector(".filter-info .name"),
filterValue = document.querySelector(".filter-info .value"),
filterSlider = document.querySelector(".slider input"),
rotateOptions = document.querySelectorAll(".rotate button"),
previewImage = document.querySelector(".preview-img img"),
chooseImageBtn = document.querySelector(".choose-img"),
resetFilterBtn = document.querySelector(".controls .reset-filter"),
SaveImageBtn = document.querySelector(".controls .save-img");

let brightness = 100,
  saturation = 100,
  inversion = 0,
  grayscale = 0;

let rotate = 0, filpHorizontal=1, flipVerticle = 1;

const applyFilters = ()=>{
    previewImage.style.transform = `rotate(${rotate}deg) scale(${filpHorizontal}, ${flipVerticle})`;
    previewImage.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
}

const loadImage = () => {
  let file = fileinput.files[0]; //getting selected file
  if (!file) return; //return if user hasn't selected the file
  previewImage.src = URL.createObjectURL(file); //passing file url as img src
  previewImage.addEventListener("load", () => {
    resetFilterBtn.click(); //when new img loaded then previous filter are edited
    document.querySelector(".container").classList.remove("disable");
  });
};

filterOptions.forEach((option) => {
  option.addEventListener("click", () => {
    //adding click event listner to all filter button
    document.querySelector(".filter .active").classList.remove("active");
    option.classList.add("active");
    filterName.innerText = option.innerText;

    if(option.id === "Brightness"){
        filterSlider.max = "200";
        filterSlider.value = brightness;
        filterValue.innerText = `${brightness}%`;
    }else if(option.id === "Saturation"){
        filterSlider.max = "200";
        filterSlider.value = saturation;
        filterValue.innerText = `${saturation}%`;
    }
    else if(option.id === "Inversion"){
        filterSlider.max = "100";
        filterSlider.value = inversion;
        filterValue.innerText = `${inversion}%`;
    }
    else{
        filterSlider.max = "100";
        filterSlider.value = grayscale;
        filterValue.innerText = `${grayscale}%`;
    }

  });
});

const updateFilter = () => {
  filterValue.innerText = `${filterSlider.value}%`;
  const selectedFilter = document.querySelector(".filter .active");
  if(selectedFilter.id === "Brightness"){
        brightness = filterSlider.value;
  }else if(selectedFilter.id === "Saturation"){
        saturation = filterSlider.value;
  }else if(selectedFilter.id === "Inversion"){
        inversion = filterSlider.value;
  }else{
        grayscale = filterSlider.value;
  }
  applyFilters();
};


rotateOptions.forEach((option)=>{
    //adding click event listner to all rotate button
    option.addEventListener("click", ()=>{
        if(option.id === "left"){
            rotate = rotate - 90;
        }else if(option.id === "right"){
            rotate = rotate + 90;
        }else if(option.id === "horizontal"){
            filpHorizontal = (filpHorizontal===1)?-1:1;
        }else{
            flipVerticle =  (flipVerticle===1)?-1:1;
        }
        applyFilters();
    });
});

const resetFilter = ()=>{
  brightness = 100;
  saturation = 100;
  inversion = 0;
  grayscale = 0;

rotate = 0; filpHorizontal=1; flipVerticle = 1;
filterOptions[0].click(); //clicking brightness so the brightness selected by default
applyFilters();
};

const saveImage= ()=>{
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = previewImage.naturalWidth;
    canvas.height = previewImage.naturalHeight;
    //applying user selected filter to canvas filter
    ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
    ctx.translate( canvas.width/2, canvas.height/2);
    if(rotate!=0){
        ctx.rotate(rotate * Math.PI / 180);
    }
    ctx.scale(filpHorizontal, flipVerticle); //flip canvas horizontally/vertically
    ctx.drawImage(previewImage, -canvas.width/2, -canvas.height/2, canvas.width, canvas.height);
    const link = document.createElement("a");
    link.download = "image.jpg";
    link.href = canvas.toDataURL(); //it returns a data url containg arepresentation of image
    link.click();
};

fileinput.addEventListener("change", loadImage);
filterSlider.addEventListener("change", updateFilter);
chooseImageBtn.addEventListener("click", () => fileinput.click());
resetFilterBtn.addEventListener("click", resetFilter);
SaveImageBtn.addEventListener("click", saveImage);