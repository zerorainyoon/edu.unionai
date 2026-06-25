import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Award, CheckCircle } from 'lucide-react';
import type { Course } from '../../data/courses';

interface CourseCardProps {
  course: Course;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const getStatusBadgeColor = (status: Course['status']) => {
    switch (status) {
      case '모집중':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case '마감임박':
        return 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse';
      case '모집마감':
        return 'bg-slate-100 text-slate-500 border-slate-200';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  return (
    <Link to={`/course/${course.id}`} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group cursor-pointer">
      {/* Visual Thumbnail Banner */}
      <style>{`.card-gradient-${course.id} { background-image: linear-gradient(135deg, ${course.gradientFrom}, ${course.gradientTo}); }`}</style>
      <div
        className={`h-36 w-full relative flex items-center justify-center overflow-hidden card-gradient-${course.id}`}
      >
        <div className="absolute inset-0 bg-black/10 opacity-60 group-hover:opacity-40 transition-opacity"></div>
        <div className="absolute top-4 left-4 flex gap-1.5 flex-wrap">
          {course.tags.map((tag, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 text-xs font-bold tracking-wider rounded-md uppercase text-white bg-white/20 backdrop-blur-md border border-white/30"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="absolute top-4 right-4">
          <span className={`px-2.5 py-0.5 text-sm font-bold rounded-full border ${getStatusBadgeColor(course.status)}`}>
            {course.status}
          </span>
        </div>

        {/* Abstract Floating Shapes */}
        <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-white/10 blur-xl group-hover:scale-125 transition-transform duration-500"></div>
        <div className="absolute -top-6 -left-6 w-20 h-20 rounded-full bg-black/5 blur-lg"></div>

        <div className="relative text-white font-extrabold text-xl translate-y-2 drop-shadow px-4 text-center select-none uppercase tracking-wide">
          {course.category}
        </div>
      </div>

      {/* Course Info Content */}
      <div className="p-5 flex flex-col flex-grow select-none">
        <h3 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-brand-secondary transition-colors duration-200 line-clamp-2 min-h-[3rem]">
            {course.title}
        </h3>

        <div className="mt-4 space-y-2.5 text-sm text-slate-500 flex-grow">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-slate-400 shrink-0" />
            <span className="truncate">교육: {course.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle size={14} className="text-slate-400 shrink-0" />
            <span className="truncate">접수: {course.applyPeriod}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-slate-400 shrink-0" />
            <span className="truncate">{course.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Award size={14} className="text-slate-400 shrink-0" />
            <span className="font-semibold text-brand-secondary">{course.fee}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
