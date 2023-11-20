import TheaterModel from "../model/TheaterModel.js";

const getAllTheathers = 
   async (req, res) => {
    console.log('route running');
    try {
        const theaters = await TheaterModel.find({});
        if (theaters) {
            return res.json({
                theaters: theaters, 
                number: TheaterModel.length
            })
            
        }
    } catch (err) {
        console.log(err)
        return res.json({
            errorMessage: err
       })
    }
}

export {getAllTheathers}