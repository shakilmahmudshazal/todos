<?php

namespace App\Http\Controllers;

use App\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::where('archive', false)
            ->orderBy('created_at', 'desc')
            ->get();

        return $projects->toJson();
    }

    public function showCompleted()
    {
        $projects = Project::where('is_completed', true)
            ->orderBy('created_at', 'desc')
            ->get();

        return $projects->toJson();
    }

    public function showActive()
    {
        $projects = Project::where('is_completed', false)
            ->orderBy('created_at', 'desc')
            ->get();

        return $projects->toJson();
    }

    public function clearCompeleted($id)
    {
        $projects = Project::where('is_completed', true)
            ->delete();

        if($id==1){
            return $this->index();

        }
        elseif($id==2){
            return $this->showActive();
        }
        else{
            return $this->showCompleted();
        }

        // return response()->json('Project created!');

    //     $projects1 = Project::where('archive', false)
    //     ->orderBy('created_at', 'desc')
    //     ->get();

    // return $projects1->toJson();

    }



    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required',
            // 'description' => 'required',
        ]);

        $project = Project::create([
            'name' => $validatedData['name'],
            // 'description' => $validatedData['description'],
        ]);

        return response()->json('Project created!');
    }

    public function show($id)
    {
        $project = Project::with(['tasks' => function ($query) {
            $query->where('is_completed', false);
        }])->find($id);

        return $project->toJson();
    }

    public function markAsCompleted(Request $request, Project $project)
    {
        $project->update($request->all());
        // return $request->all();
        return response()->json('Project updated!');
    }
}
