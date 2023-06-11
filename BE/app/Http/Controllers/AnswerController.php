<?php

namespace App\Http\Controllers;
use App\Models\Questions;
use App\Models\Answers;
use App\Models\Options;
use App\Models\UserForms;
use App\Models\User;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class AnswerController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
      $course = request()->query('course', 'BSIT');
      $course = $course === 'null' ? 'BSIT':$course;

      if ($course === 'all') {
        $u = UserForms::all()->pluck('id');
      } else {
        $u = UserForms::whereHas('users', function($query) use($course){
          $query->where('course', $course);
        })->get()->pluck('id');
      }


      // for faculty and subjects only
      $fs = UserForms::whereHas('users', function($query) use($course){
        $query->where('course', $course);
      })->whereHas('forms', function($query) use($course){
        $query->where('form_course', 'like', '%'.$course.'%');
      })->get()->pluck('id');

      $all = array();
      $faculty_and_instructions = array();
      $subjects = array();
      $student_services = array();
      $school_plant = array();
      $school_facilities_and_equipments = array();
      $school_rules_and_policies = array();
      $administration = array();

      $cat = array('faculty and instructions', 
      'subjects', 
      'student services', 
      'school plant', 
      'school facilities and equipments', 
      'school rules and policies', 
      'administration');

      foreach($cat as $c) {
        if ($course === 'all') {
          $q = Questions::with('options')->where('category', $c)->get();
        } else {
          $q = Questions::with('options')->where('category', $c)->whereHas('form', function($query) use($course){
            $query->where('form_course', 'like', '%'.$course.'%');
          })->get();
        }

        $labels0 = array();
        $values0 = array();

        $labels1 = array();
        $values1 = array();
        foreach($q as $i) {
          if($c === 'faculty and instructions' || $c === 'subjects') {
            $labels = array();
            $values = array();
            if(count($i['options']) > 0) {
              foreach($i['options'] as $o) {
                $labels[] = $o->name;
                $values[] = Answers::where('option_id', $o->id)->whereIn('user_form_id', $fs)->count();
              }
            }

            if($c === 'faculty and instructions') {
              $faculty_and_instructions[] = [
                'question' => $i->name,
                'labels' => $labels,
                'values' => $values,
              ];
            } else {
              $subjects[] = [
                'question' => $i->name,
                'labels' => $labels,
                'values' => $values,
              ];
            }
          } else {
            $labels0[] = $i->name;
            $sum1 = 0;
            $sum2 = 0;
            $sum3 = 0;
            $sum4 = 0;
            $sum5 = 0;
            foreach($i['options'] as $o) {
              if ($o->name === 'poor') {
                $sum1 = Answers::where('option_id', $o->id)->whereIn('user_form_id', $u)->count();
              } else if ($o->name === 'unsatisfied') {
                $sum2 = Answers::where('option_id', $o->id)->whereIn('user_form_id', $u)->count();
              } else if ($o->name === 'satisfied') {
                $sum3 = Answers::where('option_id', $o->id)->whereIn('user_form_id', $u)->count();
              }else if ($o->name === 'good') {
                $sum4 = Answers::where('option_id', $o->id)->whereIn('user_form_id', $u)->count();
              }else if ($o->name === 'very good') {
                $sum5 = Answers::where('option_id', $o->id)->whereIn('user_form_id', $u)->count();
              }
            }
            $values0[] = [
              'poor' => $sum1,
              'unsatisfied' => $sum2,
              'satisfied' => $sum3,
              'good' => $sum4,
              'very good' => $sum5,
            ];
          }
        }
        if ($c === 'student services') {
          $student_services[] = [
            'labels' => $labels0,
            'values' => $values0,
          ];
        } elseif($c === 'school plant'){
          $school_plant[] = [
            'labels' => $labels0,
            'values' => $values0,
          ];
        } elseif($c === 'school facilities and equipments'){
          $school_facilities_and_equipments[] = [
            'labels' => $labels0,
            'values' => $values0,
          ];
        } elseif($c === 'school rules and policies'){
          $school_rules_and_policies[] = [
            'labels' => $labels0,
            'values' => $values0,
          ];
        } elseif($c === 'administration'){
          $administration[] = [
            'labels' => $labels0,
            'values' => $values0,
          ];
        }
      }

      $course = Course::with('students')->get();

        $all = [
          'faculty_and_instructions' =>  $faculty_and_instructions,
          'subjects' =>  $subjects,
          'student_services' => $student_services, 
          'school_plant' => $school_plant, 
          'school_facilities_and_equipments' => $school_facilities_and_equipments, 
          'school_rules_and_policies' => $school_rules_and_policies, 
          'administration' => $administration,
          'course' => $course
        ];
        
        return response($all);
    }

    public function recommendations()
    {
      $course = request()->query('course', 'BSIT');
      $course = $course === 'null' ? 'BSIT':$course;

      if ($course === 'all') {
        $u = UserForms::all()->pluck('id');
      } else {
        $u = UserForms::whereHas('users', function($query) use($course){
          $query->where('course', $course);
        })->get()->pluck('id');
      }

      $final = array();

      $cat = array('faculty and instructions', 
      'subjects', 
      'student services', 
      'school plant', 
      'school facilities and equipments', 
      'school rules and policies', 
      'administration');

       foreach($cat as $c) {
      
        if ($course === 'all') {
          $q = Questions::with('options')->where('category', $c)->get();
        } else {
          $q = Questions::with('options')->where('category', $c)->whereHas('form', function($query) use($course){
            $query->where('form_course', 'like', '%'.$course.'%')->orWhere('form_course', 'like', '%ALL%');
          })->get();
        }

        $options = Options::where('type', 'recommendations')->whereIn('question_id', $q->pluck('id'))->get();

        $labels = array();
        $values = array();
        $others = array();
        $all = array();
        $r = array();

        if(count($options) > 0) {
          foreach($options as $o) {
              $r[] = ['label' => $o->name, 'values' => Answers::where('option_id', $o->id)->count()];
              $others[] = Answers::where('option_id', $o->id)->whereNotNull('remarks')->count();
            
          }
          $all[] = [
            'recommendations' => $r,
            'others' => $others,
          ];
        }

        $final[] = [
          'form' => $c,
          'data' => $all
        ];
      }

      return response($final);
      
     
     

      
      // $faculty_and_instructions = array();
      // $subjects = array();
      // $student_services = array();
      // $school_plant = array();
      // $school_facilities_and_equipments = array();
      // $school_rules_and_policies = array();
      // $administration = array();

      // $cat = array('faculty and instructions', 
      // 'subjects', 
      // 'student services', 
      // 'school plant', 
      // 'school facilities and equipments', 
      // 'school rules and policies', 
      // 'administration');

      //  foreach($cat as $c) {
      //   $all = array();
      //   if ($course === 'all') {
      //     $q = Questions::with('options')->where('category', $c)->get();
      //   } else {
      //     $q = Questions::with('options')->where('category', $c)->whereHas('form', function($query) use($course){
      //       $query->where('form_course', 'like', '%'.$course.'%');
      //     })->get();
      //   }
        
      //   foreach($q as $i) {
      //     $labels = array();
      //     $values = array();
      //     $others = array();
      //     if(count($i['options']) > 0) {
      //       foreach($i['options'] as $o) {
      //         if($o->type === 'recommendations'){
      //           $labels[] = $o->name;
      //           $values[] = Answers::where('option_id', $o->id)->whereIn('user_form_id', $u)->count();
      //           $others[] = Answers::where('option_id', $o->id)->whereNotNull('remarks')->whereIn('user_form_id', $u)->count();
      //         }
      //       }
      //     }
          
      //     $all[] = [
      //       'labels' => $labels,
      //       'values' => $values,
      //       'others' => $others,
      //       'options' => $options,
      //     ];
      //  // }

      //   $final[] = [
      //     'form' => $c,
      //     'data' => $all
      //   ];
    
    
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request)
    {
       
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
      $input = $request->input('survey');
    
      foreach($input['forms'] as $f) {
        $userform = UserForms::create(['user_id'=> $input['user_id'], 'form_id'=> $f]);
        $ansform = array_filter(
          $input['answers'],
          function ($arr) use ($f) {
            return $arr['formid'] === $f;
          }
        );

        foreach($ansform as $i) {
          if ($i['answerOptionId'] === NULL) {
            Answers::create([
              'description' => $i['description'],
              'question_id' => $i['questionid'],
              'remarks' => $i['remarks'],
              'subjects_handled' => $i['subjects_handled'],
              'reason' => $i['reason'],
              'instructor' => $i['instructor'],
              'user_form_id' => $userform->id,
            ]);
          } else {
            if(gettype($i['answerOptionId']) === 'array') {
              foreach($i['answerOptionId'] as $o) {
                Answers::create([
                  'description' => $i['description'],
                  'option_id' => $o,
                  'question_id' => $i['questionid'],
                  'remarks' => $i['remarks'],
                  'subjects_handled' => $i['subjects_handled'],
                  'reason' => $i['reason'],
                  'instructor' => $i['instructor'],
                  'user_form_id' => $userform->id,
                ]);
              }
            } else {
              Answers::create([
                'description' => $i['description'],
                'option_id' => $i['answerOptionId'],
                'question_id' => $i['questionid'],
                'remarks' => $i['remarks'],
                'subjects_handled' => $i['subjects_handled'],
                'reason' => $i['reason'],
                'instructor' => $i['instructor'],
                  'user_form_id' => $userform->id,
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
        //
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
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
