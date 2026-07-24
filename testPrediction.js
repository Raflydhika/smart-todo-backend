import PredictionService from './services/PredictionService.js';

async function test() {
  try {
    const prediction = await PredictionService.predictTaskDuration(4, 200);

    console.log('Predicted Time :', prediction);
  } catch (err) {
    console.error(err);
  }
}

test();
