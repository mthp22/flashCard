import express from 'express';
import CardModels from '../models/CardModels';

const router= express.Router();

router.get('/', async (req,res)=>{
    const cards= await CardModels.find();
    res.json(cards);
});

router.post('/', async (req, res)=>{
    const card= new CardModels(req.body);
    await card.save();
    res.json({card});
});

router.delete('/:id', async(req, res) => {
    await CardModels.findByIdAndDelete(req.params.id);
    res.json({ success:true , message: 'Card deleted'});
});

router.put('/:id', async (req, res)=>{
    const updated= await CardModels.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ updated });
});

export default router;