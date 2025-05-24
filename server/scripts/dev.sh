if [ -f ../../.env ]; then
    source ../../.env
else
    exit 1
fi
eval "$($HOME/miniconda3/bin/conda shell.bash hook)" && conda activate $CONDA_ENV
echo "Running in development mode..."
python -m uvicorn server:app --port 9003 --reload
