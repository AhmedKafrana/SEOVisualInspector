import { useState } from 'react';
import { MetaTag } from '@shared/schema';
import { CheckCircle, AlertTriangle, XCircle, Search } from 'lucide-react';
import CopyCodeBlock from '@/components/ui/copy-code-block';

type AllTagsTabProps = {
  tags: MetaTag[];
};

// Helper to get the status badge with icon
const getStatusBadge = (status: string) => {
  switch(status) {
    case 'good':
      return (
        <span className="px-2 py-1 inline-flex items-center text-xs leading-4 font-semibold rounded-full bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Good
        </span>
      );
    case 'warning':
      return (
        <span className="px-2 py-1 inline-flex items-center text-xs leading-4 font-semibold rounded-full bg-yellow-100 text-yellow-800">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Warning
        </span>
      );
    case 'missing':
    case 'error':
      return (
        <span className="px-2 py-1 inline-flex items-center text-xs leading-4 font-semibold rounded-full bg-red-100 text-red-800">
          <XCircle className="h-3 w-3 mr-1" />
          Missing
        </span>
      );
    default:
      return (
        <span className="px-2 py-1 inline-flex items-center text-xs leading-4 font-semibold rounded-full bg-slate-100 text-slate-800">
          Unknown
        </span>
      );
  }
};

// Helper to generate HTML code for tag
const getTagHtml = (tag: MetaTag) => {
  switch(tag.tagType) {
    case 'title':
      return `<title>${tag.value || ''}</title>`;
    case 'meta':
      return `<meta ${tag.attribute}${tag.value ? ` content="${tag.value}"` : ''}>`;
    case 'link':
      return `<link ${tag.attribute} href="${tag.value || ''}">`;
    case 'html':
      return `<html ${tag.attribute}="${tag.value || ''}">`;
    default:
      return `<${tag.tagType} ${tag.attribute || ''}>${tag.value || ''}</${tag.tagType}>`;
  }
};

export default function AllTagsTab({ tags }: AllTagsTabProps) {
  // Filter tags by status for statistics
  const goodTags = tags.filter(tag => tag.status === 'good').length;
  const warningTags = tags.filter(tag => tag.status === 'warning').length;
  const errorTags = tags.filter(tag => tag.status === 'missing' || tag.status === 'error').length;
  
  // Filter and search functionality
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredTags = tags.filter(tag => {
    // Apply status filter if selected
    if (filterStatus && filterStatus !== 'all' && tag.status !== filterStatus) {
      return false;
    }
    
    // Apply search query if entered
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        tag.tagType.toLowerCase().includes(query) ||
        (tag.attribute && tag.attribute.toLowerCase().includes(query)) ||
        (tag.value && tag.value.toLowerCase().includes(query))
      );
    }
    
    return true;
  });

  return (
    <div className="p-6">
      {/* Statistics Section */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center">
            <div className="mr-3 flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-slate-100">
              <Search className="h-5 w-5 text-slate-600" />
            </div>
            <div>
              <div className="text-sm font-medium text-slate-500">Total Tags</div>
              <div className="text-xl font-semibold">{tags.length}</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center">
            <div className="mr-3 flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-green-100">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <div className="text-sm font-medium text-slate-500">Good Tags</div>
              <div className="text-xl font-semibold">{goodTags}</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center">
            <div className="mr-3 flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-yellow-100">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <div className="text-sm font-medium text-slate-500">Warnings</div>
              <div className="text-xl font-semibold">{warningTags}</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center">
            <div className="mr-3 flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-red-100">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <div className="text-sm font-medium text-slate-500">Issues</div>
              <div className="text-xl font-semibold">{errorTags}</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Filters and Search */}
      <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <div className="text-sm font-medium text-slate-700">Filter:</div>
          <div className="flex space-x-1">
            <button 
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1 text-xs font-medium rounded-full ${filterStatus === 'all' || !filterStatus ? 'bg-primary text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            >
              All
            </button>
            <button 
              onClick={() => setFilterStatus('good')}
              className={`px-3 py-1 text-xs font-medium rounded-full ${filterStatus === 'good' ? 'bg-green-500 text-white' : 'bg-green-100 text-green-800 hover:bg-green-200'}`}
            >
              Good
            </button>
            <button 
              onClick={() => setFilterStatus('warning')}
              className={`px-3 py-1 text-xs font-medium rounded-full ${filterStatus === 'warning' ? 'bg-yellow-500 text-white' : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'}`}
            >
              Warning
            </button>
            <button 
              onClick={() => setFilterStatus('missing')}
              className={`px-3 py-1 text-xs font-medium rounded-full ${filterStatus === 'missing' ? 'bg-red-500 text-white' : 'bg-red-100 text-red-800 hover:bg-red-200'}`}
            >
              Issues
            </button>
          </div>
        </div>
        
        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-md text-sm placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            placeholder="Search tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {/* Tags Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Tag Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Attribute
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Value
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredTags.map((tag, index) => (
                <tr key={index} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                    {tag.tagType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-mono">
                    {tag.attribute || '-'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-700 max-w-xs truncate">
                      {tag.value || '-'}
                    </div>
                    <div className="mt-1">
                      <CopyCodeBlock code={getTagHtml(tag)} className="text-xs" />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(tag.status)}
                  </td>
                </tr>
              ))}
              
              {/* Show a message if no tags found */}
              {filteredTags.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center">
                    <div className="flex flex-col items-center">
                      <Search className="h-10 w-10 text-slate-300 mb-3" />
                      <p className="text-slate-500 font-medium">No matching tags found</p>
                      <p className="text-sm text-slate-400">
                        {searchQuery ? 'Try a different search term' : 'No meta tags were detected on the page'}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
