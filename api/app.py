from flask_openapi3 import OpenAPI, Info, Tag
from flask import redirect
from urllib.parse import unquote

from model import *
from logger import logger
from schemas.flight_schema import FlightSchema, FlightResponseSchema
from flask_cors import CORS

# Instantiate the OpenAPI app
info = Info(title="Flight Delay Prediction API", version="1.0.0")
app = OpenAPI(__name__, info=info, static_folder="../front", static_url_path="/front")
CORS(app)

# definig tags
home_tag = Tag(
    name="Documentation",
    description="Documentation Selection: Swagger, Redoc or Rapidoc"
)
flight_tag = Tag(
    name="Flight",
    description="Flight Delay Prediction"
)

# Define the home route
@app.get("/", tags=[home_tag])
def home():
    """
    Redirects to frontend index.html file.
    """
    logger.info("Redirecting to the frontend index.html file.")
    return redirect("/front/index.html")

# Define the documentation route
@app.get("/docs", tags=[home_tag])
def docs():
    """
    Redirects to the openAPI documentation.
    """
    logger.info("Redirecting to the openAPI documentation.")
    return redirect("/openapi")

# Define the flight delay prediction route
@app.get(
    "/flight",
    tags=[flight_tag],
    responses={
        200: FlightResponseSchema,
        400: ErrorSchema,
        500: ErrorSchema,
    }
)
def flight_delay_prediction(form: FlightSchema):
    """
    Predicts flight delay based on the provided parameters.
    
    Parameters:
        - form: FlightSchema containing origin, destination, date, time, airline, length, and flight_number.
    Returns:
        A JSON response with the prediction result.
    """
    logger.info("Received flight delay prediction request.")
    airline = form.airline
    flight = form.flight
    airportFrom = form.airportFrom
    airportTo = form.airportTo
    dayOfWeek = form.dayOfWeek
    time = form.time
    length = form.length

    logger.info(f"Parameters received: airline={airline}, flight={flight}, airportFrom={airportFrom}, airportTo={airportTo}, dayOfWeek={dayOfWeek}, time={time}, length={length}")

    # Predict flight delay using the model
    # prepare the input data
    X_input = pd.DataFrame({
        'Airline': [form.airline],
        'Flight': [form.flight],
        'AirportFrom': [form.airportFrom],
        'AirportTo': [form.airportTo],
        'DayOfWeek': [form.dayOfWeek],
        'Time': [form.time],
        'Length': [form.length]
    })
    logger.info(f"Input data for prediction: {X_input}")
    # path to the pipeline of the model
    model_path = "api\machinelearning\pipelines\model_pipeline_SVM.pkl"

    # load the pipeline model
    with open(model_path, "rb") as f:
        model_pipeline = pickle.load(f)
    logger.info("Model pipeline loaded successfully.")
    # make the prediction
    prediction = model_pipeline.predict(X_input)
    logger.info(f"Prediction result: {prediction}")
    # Prepare the response

    return FlightResponseSchema(prediction=int(prediction))
