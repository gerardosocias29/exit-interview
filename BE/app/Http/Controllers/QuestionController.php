<?php

namespace App\Http\Controllers;
use App\Models\Answers;
use App\Models\UserForms;
use App\Models\Questions;
use App\Models\Forms;
use App\Models\Options;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class QuestionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($id)
    {
      $n = Questions::where('form_id', $id)->where('category', 'N/A ')->get();
      $f = Questions::where('form_id', $id)->where('category', 'faculty and instructions ')->get();
      $sub = Questions::where('form_id', $id)->where('category', 'subjects')->get();
      $st = Questions::where('form_id', $id)->where('category', 'student services')->get();
      $plant = Questions::where('form_id', $id)->where('category', 'school plant')->get();
      $e = Questions::where('form_id', $id)->where('category', 'school facilities and equipments')->get();
      $p = Questions::where('form_id', $id)->where('category', 'school rules and policies')->get();
      $a = Questions::where('form_id', $id)->where('category', 'administration')->get();
      $m = $n->merge($f)->merge($sub)->merge($st)->merge($plant)->merge($e)->merge($p)->merge($a);
      
      return response(Questions::where('form_id', $id)->get());
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
      $input = $request->input('form');
      $form = Forms::create(['name'=>$input['name'], 'form_course' => $input['form_course']]);
      if ($form->id){
        foreach($input['questions'] as $i) {
          $q = Questions::create([
            'name' => $i['name'],
            'placeholder' => $i['placeholder'],
            'isRequired' => $i['isRequired'],
            'isFilter' => $i['isFilter'],
            'type' => $i['type'],
            'category' => $i['category'],
            'sub_title' => $i['sub_title'],
            'form_id' => $form->id,
          ]);

          if($i['type'] === 'radio' || $i['type'] === 'checkbox') {
            foreach($i['options'] as $o) {
              Options::create([
                'name' => $o,
                'question_id' => $q->id,
                'type' => 'options',
              ]);
            }

            foreach($i['recommendations'] as $o) {
              Options::create([
                'name' => $o,
                'question_id' => $q->id,
                'type' => 'recommendations',
              ]);
            }
          }
        }
      }
      return response([
        'message' => 'success'
      ], 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
      $form = UserForms::find($id);
      $q =  Questions::with('options')->where('form_id', $form->form_id)->get();
      $a = array();
      foreach($q as $i) {
        $ans = Answers::where('user_form_id', $id)->where('question_id', $i->id)->get();
        $a[] = [
          'question' => $i,
          'answer' => $ans,
        ];
      }

      $category = array();
      $questions = array();
      $answers = array();

      $categories = UserForms::with('forms')->where('user_id', $form->user_id)->get();

      foreach($categories as $c) {
        //$category[] = $c->forms;
        $questions = array();
        $qc =  Questions::with('options')->where('form_id', $c->id)->get();
        foreach($qc as $ques) {
          $questions[] = $ques;

          $answers = array();
          foreach($q as $i) {
            $ans = Answers::where('user_form_id', $id)->where('question_id', $i->id)->get();
            $answers[] = [
              'question' => $i,
              'answer' => $ans,
            ];
          }
        }

        $category[] = [
          'form' => $c->forms,
          'answers' => $answers
        ];
      }



      // $q = Questions::with('answers')->with('options')->whereHas('answers', function($query) use($id){
      //   $query->where('user_form_id', $id)->get();
      // });
      
     // $question
      return response(['individual' => $a, 'group' => $category]);
    }

    public function showGroup($id)
    {
      $user = User::where('id', $id)->first();

      $category = array();
      $questions = array();
      $answers = array();

      $categories = UserForms::with('forms')->where('user_id', $user->id)->get();

      foreach($categories as $c) {
        //$category[] = $c->forms;
        $questions = array();
        $qc =  Questions::with('options')->where('form_id', $c->forms->id)->get();
        foreach($qc as $ques) {
          $questions[] = $qc;

          $answers = array();
          foreach($qc as $i) {
            $ans = Answers::where('user_form_id', $c->id)->where('question_id', $i->id)->get();
            $answers[] = [
              'question' => $i,
              'answer' => $ans,
            ];
          }
        }

        $category[] = [
          'form' => $c->forms,
          'answers' => $answers,
          'questions' => $questions
        ];
      }

      return response(['user' => $user, 'data' => $category]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
      $input = $request->input('form');
      $form = Forms::find($id);
      $ids = array();

      $form->name = $input['name'];
      $form->form_course = $input['form_course'];
      $form->save();

      foreach($input['questions'] as $i) {
        if ($i['id']) {
          $q = Questions::find($i['id']);
          $q->update([
            'name' => $i['name'],
            'placeholder' => $i['placeholder'],
            'isRequired' => $i['isRequired'],
            'isFilter' => $i['isFilter'],
            'category' => $i['category'],
            'type' => $i['type'],
            'sub_title' => $i['sub_title'],
          ]);

          if($i['type'] === 'radio' || $i['type'] === 'checkbox') {
            // delete options
            Options::whereIn('id', $i['delOptions'])->delete();

            //add new ones
            foreach($i['options'] as $o) {
              Options::create([
                'name' => $o,
                'question_id' => $q->id,
                'type' => 'options',
              ]);
            }

             // delete reco
             Options::whereIn('id', $i['delRecommendations'])->delete();
            foreach($i['recommendations'] as $o) {
              Options::create([
                'name' => $o,
                'question_id' => $q->id,
                'type' => 'recommendations',
              ]);
            }
          }

          $ids[] = $i['id'];
        }
        else {
          $q = Questions::create([
            'name' => $i['name'],
            'placeholder' => $i['placeholder'],
            'isRequired' => $i['isRequired'],
            'isFilter' => $i['isFilter'],
            'category' => $i['category'],
            'sub_title' => $i['sub_title'],
            'type' => $i['type'],
            'form_id' => $form->id,
          ]);

          if($i['type'] === 'radio' || $i['type'] === 'checkbox') {
            foreach($i['options'] as $o) {
              Options::create([
                'name' => $o,
                'question_id' => $q->id,
                'type' => 'options',
              ]);
            }

            foreach($i['recommendations'] as $o) {
              Options::create([
                'name' => $o,
                'question_id' => $q->id,
                'type' => 'recommendations',
              ]);
            }
          }
          $ids[] = $q->id;
        }
      }

      Questions::where('form_id', $form->id)->whereNotIn('id', $ids)->delete();
    
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        
    }
}
