from jinja2 import Environment
from jinja2.parser import Parser
from jinja2.nodes import Name


def get_variable_names(content):
    env = Environment()
    parser = Parser(env, source=content)  
    stream = parser.parse()  
    
    variables = []  
    for node in stream.iter_child_nodes():  
        for sub_node in node.iter_child_nodes():
            if isinstance(sub_node, Name):
                variables.append(sub_node)
    names = [item.name for item in variables]
    return names
  
import gradio as gr  
  
def greet(name):  
    return f"Hello, {name}!"  
  
def survey(language):  
    if language == "Python":  
        return gr.components.Textbox(value="What do you like most about Python?")  
    elif language == "JavaScript":  
        return gr.components.Textbox(value="What do you like most about JavaScript?")  
    else:  
        return gr.components.Textbox(value="What do you like about programming?")  
  
def submit(answer):  
    return f"Thanks for sharing! You said: {answer}"  
  
with gr.Blocks() as demo:  
    with gr.Row():
        language_choice = gr.components.Dropdown(["Python", "JavaScript", "Other"], label="What's your favorite programming language?")  
        survey_question = survey(language_choice)  
    with gr.Row():  
        answer = gr.components.Textbox(label="Answer")  
    submit_button = gr.components.Button("Submit")  
    submit_button.click(fn=submit, inputs=answer, outputs="output")  
  
    language_choice.change(fn=survey, outputs=survey_question)  
  
demo.launch(debug=True)