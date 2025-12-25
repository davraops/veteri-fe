import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Paper,
  Menu,
  MenuItem,
  InputBase,
  Button,
  CircularProgress,
} from '@mui/material';
import {
  ChatBubbleOutline as ChatIcon,
  History as HistoryIcon,
  MoreVert as MoreVertIcon,
  DriveFileRenameOutline as RenameIcon,
  Share as ShareIcon,
  FileDownload as ExportIcon,
  Delete as DeleteIcon,
  ExpandLess as ChevronUpIcon,
  ExpandMore as ChevronDownIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Add as AddIcon,
  Send as SendIcon,
  ArrowDropDown as ArrowDropDownIcon,
  Pets as PetsIcon,
  AttachFile as AttachFileIcon,
  Image as ImageIcon,
  UploadFile as UploadFileIcon,
  Check as CheckIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import logo from '@/assets/logo.png';

export const Route = createFileRoute('/consultant')({
  component: Consultant,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      query: (search.query as string) || '',
      conversationId: (search.conversationId as string) || '',
    };
  },
});

interface Consultation {
  id: string;
  conversationId: string;
  query: string;
  response: string;
  date: string;
  model: string;
}

interface ConversationMessage {
  id: string;
  query: string;
  response?: string;
  timestamp: Date;
}

function Consultant() {
  const { query, conversationId } = Route.useSearch();
  const navigate = useNavigate();
  const [menuAnchor, setMenuAnchor] = useState<{
    [key: string]: HTMLElement | null;
  }>({});
  const [historyExpanded, setHistoryExpanded] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showNewConsultation, setShowNewConsultation] = useState(false);
  const [newQueryValue, setNewQueryValue] = useState('');
  const [continueQueryValue, setContinueQueryValue] = useState('');
  const [selectedModel, setSelectedModel] = useState('veterai-3.1');
  const [attachMenuAnchor, setAttachMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const [modelMenuAnchor, setModelMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const [conversationMessages, setConversationMessages] = useState<
    ConversationMessage[]
  >([]);
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);
  const messageIdCounter = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Helper function to generate unique IDs
  const generateMessageId = (prefix: string): string => {
    messageIdCounter.current += 1;
    return `${prefix}-${Date.now()}-${messageIdCounter.current}-${Math.random().toString(36).substring(2, 9)}`;
  };
  const [consultations] = useState<Consultation[]>([
    {
      id: '1',
      conversationId: 'conv-1',
      query: 'What are the symptoms of parvovirus in dogs?',
      response:
        'Parvovirus in dogs presents with several severe symptoms that require immediate attention. The most common signs include severe vomiting, often with a characteristic foul odor, and bloody diarrhea that can lead to rapid dehydration. Affected dogs typically show extreme lethargy, refusing to move or play, along with a complete loss of appetite. Fever is also common, with temperatures often reaching 104-106°F. Puppies between 6 weeks and 6 months are most susceptible, especially unvaccinated ones. The virus attacks rapidly dividing cells, particularly in the intestinal lining and bone marrow, which explains the severe gastrointestinal symptoms and potential for secondary infections. Immediate veterinary care is crucial as the disease can be fatal within 48-72 hours if left untreated. Treatment involves aggressive fluid therapy, anti-nausea medications, antibiotics to prevent secondary infections, and supportive care.',
      date: '2024-01-15',
      model: 'VeteriAI 3.1',
    },
    {
      id: '2',
      conversationId: 'conv-2',
      query: 'How to treat a cat with upper respiratory infection?',
      response:
        'Upper respiratory infections in cats, often caused by feline herpesvirus or calicivirus, require a comprehensive treatment approach. Start with antibiotics if a bacterial component is suspected, typically amoxicillin-clavulanate or doxycycline. Supportive care is essential: ensure the cat stays well-hydrated by offering wet food and fresh water, and consider using a humidifier to help with nasal congestion. Keep the cat isolated from other pets to prevent spread, and maintain a clean environment by regularly cleaning food and water bowls, litter boxes, and bedding. Nasal and eye discharge should be gently cleaned with warm saline solution. Appetite stimulants may be necessary if the cat stops eating. Most cats recover within 7-14 days, but some may become chronic carriers. Severe cases may require hospitalization for fluid therapy and nutritional support.',
      date: '2024-01-14',
      model: 'Grok 3',
    },
    {
      id: '3',
      conversationId: 'conv-3',
      query: 'Dosage for amoxicillin in a 5kg dog',
      response:
        "For a 5kg dog, the typical amoxicillin dosage ranges from 10-20mg/kg, which translates to 50-100mg per dose. This is usually administered every 8-12 hours, depending on the severity of the infection. The exact dosage and frequency should always be determined by your veterinarian based on the specific condition being treated, the dog's overall health, and the type of infection. For skin infections, the lower end of the range is often sufficient, while more serious infections like pneumonia may require the higher dosage. The treatment course typically lasts 7-14 days, and it's crucial to complete the full course even if symptoms improve earlier. Always follow your veterinarian's prescription exactly, as underdosing can lead to antibiotic resistance, and overdosing can cause gastrointestinal upset or other adverse effects.",
      date: '2024-01-13',
      model: 'VeteriAI 3.1',
    },
    {
      id: '4',
      conversationId: 'conv-4',
      query: 'What vaccines does a puppy need at 8 weeks?',
      response:
        "At 8 weeks of age, puppies typically receive their first core vaccination, which is the DHPP combination vaccine. This protects against distemper (a serious viral disease affecting multiple body systems), hepatitis (caused by adenovirus type 1), parainfluenza (a respiratory virus), and parvovirus (a highly contagious and often fatal gastrointestinal virus). Some veterinarians may also start the rabies vaccination series at this age, though it's more commonly given at 12-16 weeks depending on local regulations. The DHPP vaccine requires booster shots at 12 and 16 weeks, and then annually or every 3 years depending on the vaccine type. Your veterinarian will create a personalized vaccination schedule based on your puppy's breed, lifestyle, and local disease prevalence. It's important to keep puppies away from unvaccinated dogs and public areas until the vaccination series is complete, typically around 16 weeks of age.",
      date: '2024-01-12',
      model: 'GPT 4.5',
    },
    {
      id: '5',
      conversationId: 'conv-5',
      query: 'How to diagnose diabetes in cats?',
      response:
        "Diagnosing diabetes in cats involves a combination of clinical signs, blood tests, and urinalysis. The most common clinical signs include increased thirst (polydipsia) and urination (polyuria), weight loss despite a good or increased appetite, and sometimes weakness in the hind legs. Blood glucose testing is essential, with diabetic cats typically showing persistent hyperglycemia (elevated blood glucose above 250-300 mg/dL). However, stress can cause temporary hyperglycemia in cats, so a single high reading isn't diagnostic. A fructosamine test provides a better picture, measuring average blood glucose over the past 2-3 weeks. Urinalysis typically shows glucosuria (glucose in urine) and sometimes ketones, which indicate more severe disease. Your veterinarian will also check for concurrent conditions like pancreatitis or urinary tract infections, which are common in diabetic cats. Early diagnosis and treatment are crucial to prevent complications like diabetic ketoacidosis, which is a life-threatening emergency.",
      date: '2024-01-11',
      model: 'VeteriAI 3.1',
    },
    {
      id: '6',
      conversationId: 'conv-6',
      query: 'Treatment protocol for heartworm disease',
      response:
        'Heartworm treatment in dogs is a multi-stage process that requires strict adherence to protocols. The treatment begins with a thorough evaluation including blood tests, X-rays, and sometimes echocardiography to assess the severity of infection. Dogs are typically started on doxycycline and a heartworm preventive to kill immature worms and reduce the risk of complications. The actual adulticide treatment involves a series of injections of melarsomine, administered deep into the back muscles. The protocol usually includes an initial injection, followed by two more injections 30 days later. Throughout treatment, strict exercise restriction is absolutely critical - dogs must be kept calm and quiet, as increased activity can cause dead worms to break off and cause fatal pulmonary embolisms. This restriction typically lasts for 4-6 months. Regular monitoring through blood tests and X-rays is essential. The entire process can take 6-9 months, and dogs should remain on heartworm prevention year-round afterward. Some cases may require additional treatments or surgical removal of worms in severe cases.',
      date: '2024-01-10',
      model: 'Grok 3',
    },
    {
      id: '7',
      conversationId: 'conv-7',
      query: 'What is the normal body temperature for a rabbit?',
      response:
        "The normal body temperature for rabbits ranges from 101.3°F to 104°F (38.5°C to 40°C), with the average being around 102.5°F (39.2°C). It's important to note that rabbits are very sensitive to temperature changes and can easily overheat or become hypothermic. Temperatures above 104°F indicate fever and may signal infection or heat stress, which is a medical emergency in rabbits. Conversely, temperatures below 100°F suggest hypothermia, which can also be life-threatening. Rabbits don't tolerate heat well and should be kept in environments between 60-70°F. If you suspect your rabbit has an abnormal temperature, it's crucial to seek veterinary care immediately, as rabbits can deteriorate rapidly. When taking a rabbit's temperature, use a digital rectal thermometer with lubrication, and be very gentle as rabbits are delicate animals. Any deviation from normal temperature should be evaluated by a veterinarian experienced with rabbits.",
      date: '2024-01-09',
      model: 'VeteriAI 3.1',
    },
    {
      id: '8',
      conversationId: 'conv-8',
      query: 'How to perform a dental cleaning on a dog?',
      response:
        "Professional dental cleanings for dogs require general anesthesia to ensure safety and thoroughness. During the procedure, the veterinarian will scale the teeth to remove tartar above and below the gum line, polish the teeth to smooth surfaces and prevent future plaque buildup, and perform a complete oral examination. X-rays are often taken to evaluate the health of tooth roots and jawbone below the gum line, which can reveal hidden problems. The procedure typically takes 45-90 minutes depending on the severity of dental disease. Home care is equally important and includes daily brushing with dog-specific toothpaste (never human toothpaste), dental chews approved by the Veterinary Oral Health Council, and possibly water additives or dental diets. Regular professional cleanings, typically annually or as recommended by your veterinarian, are essential to prevent periodontal disease, which can lead to tooth loss, pain, and even systemic health issues like heart and kidney disease. Starting dental care early in a dog's life makes maintenance much easier.",
      date: '2024-01-08',
      model: 'GPT 4.5',
    },
    {
      id: '9',
      conversationId: 'conv-9',
      query: 'Symptoms and treatment of kennel cough',
      response:
        'Kennel cough, also known as infectious tracheobronchitis, is a highly contagious respiratory disease in dogs. The primary symptom is a persistent, dry, hacking cough that often sounds like the dog has something stuck in its throat. Other symptoms can include nasal discharge, mild fever, lethargy, and loss of appetite. The cough is often worse after exercise or excitement. Treatment depends on the severity: mild cases may resolve on their own with rest and supportive care, while more severe cases require antibiotics if a bacterial component is present (Bordetella bronchiseptica is common). Cough suppressants may be prescribed to provide relief, but should be used carefully as coughing helps clear the airways. The disease is typically self-limiting, lasting 1-3 weeks, but can progress to pneumonia in young, old, or immunocompromised dogs. Prevention through vaccination is recommended, especially for dogs that frequent kennels, dog parks, or grooming facilities. Isolate affected dogs to prevent spread, and ensure good ventilation in their environment.',
      date: '2024-01-07',
      model: 'VeteriAI 3.1',
    },
    {
      id: '10',
      conversationId: 'conv-10',
      query: 'What are the side effects of prednisone in cats?',
      response:
        "Prednisone, a corticosteroid commonly used in cats for various inflammatory and immune-mediated conditions, can cause several side effects. The most common include increased thirst (polydipsia) and urination (polyuria), which can be quite pronounced. Cats may also experience increased appetite, leading to weight gain if not monitored. More serious side effects with long-term use include the development of diabetes mellitus, especially in cats already predisposed. Other potential complications include suppression of the immune system (making cats more susceptible to infections), muscle weakness, thinning of the skin, and delayed wound healing. Behavioral changes such as increased irritability or restlessness can also occur. When prednisone is used long-term, it's important to taper the dose gradually rather than stopping abruptly, as sudden withdrawal can cause a life-threatening condition called Addisonian crisis. Regular monitoring through blood work and urinalysis is essential for cats on long-term prednisone therapy. Always follow your veterinarian's dosing instructions carefully.",
      date: '2024-01-06',
      model: 'Grok 3',
    },
    {
      id: '11',
      conversationId: 'conv-11',
      query: 'How to treat a dog with heatstroke?',
      response:
        "Heatstroke in dogs is a life-threatening emergency that requires immediate action. First, move the dog to a cool, shaded area or indoors with air conditioning. Begin cooling the dog immediately by applying cool (not cold) water to their body, focusing on the head, neck, and groin areas where large blood vessels are close to the surface. You can also use wet towels or a fan to aid in cooling. Offer small amounts of cool water to drink, but don't force it. Avoid using ice or very cold water, as this can cause blood vessels to constrict and actually slow cooling. Monitor the dog's temperature if possible, and stop active cooling when it reaches 103°F to prevent hypothermia. Even if the dog appears to recover, seek emergency veterinary care immediately, as heatstroke can cause internal organ damage, blood clotting disorders, and brain swelling that may not be immediately apparent. The veterinarian will provide intravenous fluids, monitor organ function, and treat any complications. Prevention is key: never leave dogs in cars, ensure access to shade and water, and avoid exercise during the hottest parts of the day.",
      date: '2024-01-05',
      model: 'VeteriAI 3.1',
    },
    {
      id: '12',
      conversationId: 'conv-12',
      query: 'Nutritional requirements for senior dogs',
      response:
        "Senior dogs have unique nutritional needs that change as they age. Generally, they require lower calorie diets to prevent obesity, as their metabolism slows and activity levels decrease. However, the diet should be high in quality protein to maintain muscle mass, which naturally declines with age. Increased fiber content helps with digestive health and can aid in weight management. Joint-supporting nutrients are crucial: glucosamine, chondroitin, and omega-3 fatty acids can help maintain joint health and reduce inflammation associated with arthritis. Senior dogs may also benefit from increased antioxidants (vitamins C and E) to support immune function and cognitive health. Some senior dogs may need diets with adjusted phosphorus and sodium levels to support kidney and heart health. Regular veterinary checkups are essential to monitor weight, body condition, and any developing health issues that might require dietary modifications. Your veterinarian can recommend specific senior dog foods or supplements based on your dog's individual needs, breed, size, and any existing health conditions.",
      date: '2024-01-04',
      model: 'GPT 4.5',
    },
    {
      id: '13',
      conversationId: 'conv-13',
      query: 'What is the recovery time after spaying a cat?',
      response:
        "Recovery time after spaying a cat typically takes 7-10 days for the initial healing phase, with full recovery complete around 2 weeks. During the first few days, the cat should be kept quiet and indoors to allow the incision to heal. It's important to monitor the incision site daily for signs of infection, such as redness, swelling, discharge, or if the cat is excessively licking the area. An Elizabethan collar (cone) may be necessary to prevent the cat from licking or chewing at the incision, which can cause infection or open the wound. The incision should be kept clean and dry - avoid bathing the cat during recovery. Most cats can return to normal activity within a week, but strenuous play should be avoided for the full 2 weeks. Pain medication may be prescribed for the first few days. Signs that require immediate veterinary attention include the incision opening, excessive swelling, pus or foul-smelling discharge, or if the cat stops eating or becomes lethargic. Most cats recover without complications, and spaying provides significant health benefits including prevention of uterine infections and certain cancers.",
      date: '2024-01-03',
      model: 'VeteriAI 3.1',
    },
    {
      id: '14',
      conversationId: 'conv-14',
      query: 'How to diagnose and treat ear infections in dogs?',
      response:
        "Diagnosing ear infections in dogs involves a thorough examination using an otoscope to visualize the ear canal and eardrum. The veterinarian will look for signs of inflammation, discharge, and any foreign objects. Cytology, examining a sample of the ear discharge under a microscope, helps identify whether the infection is bacterial, yeast, or both, which determines the appropriate treatment. The discharge's appearance and odor also provide clues - bacterial infections often produce a foul-smelling, yellow or green discharge, while yeast infections typically produce a brown, waxy, musty-smelling discharge. Treatment involves thorough ear cleaning to remove debris and discharge, followed by topical medications (ear drops) containing antibiotics, antifungals, and/or anti-inflammatory medications. The medication is typically applied twice daily for 7-14 days, and it's crucial to complete the full course even if symptoms improve. Chronic or recurrent ear infections may require systemic antibiotics and further investigation into underlying causes such as allergies, hormonal imbalances, or anatomical issues. Regular ear cleaning with a veterinarian-recommended solution can help prevent future infections. If an infection doesn't respond to treatment, a culture and sensitivity test may be needed to identify the specific organism and determine the most effective antibiotic.",
      date: '2024-01-02',
      model: 'Grok 3',
    },
    {
      id: '15',
      conversationId: 'conv-15',
      query: 'What are the signs of kidney failure in cats?',
      response:
        'Kidney failure in cats, particularly chronic kidney disease (CKD), presents with several signs that owners should be aware of. The most common early signs include increased thirst (polydipsia) and urination (polyuria) as the kidneys lose their ability to concentrate urine. Weight loss often occurs despite a normal or increased appetite, as toxins build up in the bloodstream. As the disease progresses, cats may show decreased appetite, nausea, and vomiting. Other signs can include bad breath (uremic breath), mouth ulcers, lethargy, weakness, and poor coat condition. In advanced stages, cats may become dehydrated, develop high blood pressure, and show neurological signs. Early detection through routine bloodwork is crucial, as cats are masters at hiding illness and may not show obvious signs until significant kidney function is lost. Blood tests will show elevated BUN (blood urea nitrogen) and creatinine levels, and urinalysis may reveal dilute urine and protein loss. Treatment focuses on managing symptoms, supporting kidney function through special diets, fluid therapy, and medications to control blood pressure and reduce protein loss. Regular monitoring and early intervention can significantly improve quality of life and slow disease progression.',
      date: '2024-01-01',
      model: 'VeteriAI 3.1',
    },
  ]);
  const [selectedConsultation, setSelectedConsultation] =
    useState<Consultation | null>(null);

  // Load conversation based on conversationId or query
  useEffect(() => {
    // Cleanup previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (conversationId) {
      // Find consultation by conversationId
      const consultation = consultations.find(
        (c) => c.conversationId === conversationId
      );
      if (consultation && selectedConsultation?.id !== consultation.id) {
        // Use setTimeout to avoid synchronous setState in effect
        setTimeout(() => {
          setSelectedConsultation(consultation);
          setShowNewConsultation(false);
          setConversationMessages([
            {
              id: generateMessageId(`consultation-${consultation.id}`),
              query: consultation.query,
              response: consultation.response,
              timestamp: new Date(consultation.date),
            },
          ]);
        }, 0);
      }
    } else if (query) {
      // Use setTimeout to avoid synchronous setState in effect
      setTimeout(() => {
        setSelectedConsultation(null);
        setShowNewConsultation(false);
        // Initialize conversation with the query
        const queryId = generateMessageId('query');
        setConversationMessages([
          {
            id: queryId,
            query: query,
            timestamp: new Date(),
          },
        ]);
        setIsLoadingResponse(true);
        // Simulate loading response
        timeoutRef.current = setTimeout(() => {
          setIsLoadingResponse(false);
          setConversationMessages((prev) => {
            // Check if response already exists to avoid duplicates
            const hasResponse = prev.some((msg) =>
              msg.id.startsWith('response-')
            );
            if (hasResponse) return prev;
            return [
              ...prev,
              {
                id: generateMessageId('response'),
                query: '',
                response:
                  'This is a simulated response to your query. In a real implementation, this would come from the AI model.',
                timestamp: new Date(),
              },
            ];
          });
          timeoutRef.current = null;
        }, 2000);
      }, 0);
    } else if (
      consultations.length > 0 &&
      !selectedConsultation &&
      !showNewConsultation &&
      !conversationId &&
      !query
    ) {
      // Select first consultation by default if no query or conversationId
      navigate(
        {
          to: '/consultant',
          search: { conversationId: consultations[0].conversationId },
        },
        { replace: true }
      );
    }

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [
    query,
    conversationId,
    selectedConsultation,
    showNewConsultation,
    consultations,
    navigate,
  ]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    consultationId: string
  ) => {
    event.stopPropagation();
    setMenuAnchor({ ...menuAnchor, [consultationId]: event.currentTarget });
  };

  const handleMenuClose = (consultationId: string) => {
    setMenuAnchor({ ...menuAnchor, [consultationId]: null });
  };

  const handleMenuAction = (action: string, consultationId: string) => {
    handleMenuClose(consultationId);
    // TODO: Handle action (rename, share, export, delete)
    console.log(`${action} consultation ${consultationId}`);
  };

  const handleAttachMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAttachMenuAnchor(event.currentTarget);
  };

  const handleAttachMenuClose = () => {
    setAttachMenuAnchor(null);
  };

  const handleModelMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setModelMenuAnchor(event.currentTarget);
  };

  const handleModelMenuClose = () => {
    setModelMenuAnchor(null);
  };

  const handleModelSelect = (model: string) => {
    setSelectedModel(model);
    handleModelMenuClose();
  };

  const handleContinueConversation = () => {
    if (!continueQueryValue.trim() || isLoadingResponse) return;

    // Cleanup previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const newMessage: ConversationMessage = {
      id: generateMessageId('continue-query'),
      query: continueQueryValue.trim(),
      timestamp: new Date(),
    };

    setConversationMessages((prev) => [...prev, newMessage]);
    setContinueQueryValue('');
    setIsLoadingResponse(true);

    // Simulate loading response
    timeoutRef.current = setTimeout(() => {
      setIsLoadingResponse(false);
      setConversationMessages((prev) => {
        // Check if response already exists to avoid duplicates
        const lastMessage = prev[prev.length - 1];
        if (lastMessage && lastMessage.id.startsWith('continue-response-')) {
          return prev;
        }
        return [
          ...prev,
          {
            id: generateMessageId('continue-response'),
            query: '',
            response:
              'This is a simulated response to continue the conversation. In a real implementation, this would come from the AI model based on the conversation context.',
            timestamp: new Date(),
          },
        ];
      });
      timeoutRef.current = null;
    }, 2000);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', backgroundColor: '#f6f8fa' }}>
      {/* Left Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: sidebarCollapsed ? 64 : 280,
          flexShrink: 0,
          transition: 'width 0.3s ease',
          '& .MuiDrawer-paper': {
            width: sidebarCollapsed ? 64 : 280,
            boxSizing: 'border-box',
            borderRight: '1px solid #d0d7de',
            backgroundColor: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            transition: 'width 0.3s ease',
            overflow: 'hidden',
          },
        }}
      >
        {/* Logo */}
        <Box
          onClick={() => navigate({ to: '/' })}
          sx={{
            padding: 3,
            borderBottom: '1px solid #d0d7de',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: '#f6f8fa',
            },
          }}
        >
          <Box
            component="img"
            src={logo}
            alt="Veteri"
            sx={{
              height: 40,
              width: 'auto',
            }}
          />
        </Box>

        {/* New Consultation Button */}
        <Box sx={{ padding: 2 }}>
          <ListItemButton
            onClick={() => {
              setShowNewConsultation(true);
              setSelectedConsultation(null);
            }}
            sx={{
              borderRadius: '6px',
              backgroundColor: '#f6f8fa',
              color: '#24292f',
              border: '1px solid #d0d7de',
              '&:hover': {
                backgroundColor: '#ffffff',
                borderColor: '#2563eb',
              },
              marginBottom: 2,
              justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
            }}
          >
            <ListItemIcon
              sx={{ minWidth: 'auto', marginRight: sidebarCollapsed ? 0 : 1.5 }}
            >
              <ChatIcon sx={{ fontSize: '18px', color: '#57606a' }} />
            </ListItemIcon>
            {!sidebarCollapsed && (
              <ListItemText
                primary="New Consultation"
                primaryTypographyProps={{
                  fontWeight: 500,
                  fontSize: '14px',
                  color: '#24292f',
                }}
              />
            )}
          </ListItemButton>
        </Box>

        {/* Consultation History */}
        {!sidebarCollapsed && (
          <Box
            sx={{
              flex: 1,
              overflow: 'auto',
              paddingX: 2,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 2,
                paddingX: 1,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <HistoryIcon sx={{ fontSize: '18px', color: '#57606a' }} />
                <Typography
                  sx={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#57606a',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  Consultation History
                </Typography>
              </Box>
              <IconButton
                size="small"
                onClick={() => setHistoryExpanded(!historyExpanded)}
                sx={{
                  color: '#57606a',
                  '&:hover': {
                    backgroundColor: '#f6f8fa',
                  },
                }}
              >
                {historyExpanded ? (
                  <ChevronUpIcon sx={{ fontSize: '18px' }} />
                ) : (
                  <ChevronDownIcon sx={{ fontSize: '18px' }} />
                )}
              </IconButton>
            </Box>
            {historyExpanded && (
              <List sx={{ padding: 0 }}>
                {consultations.map((consultation, index) => (
                  <Box key={consultation.id}>
                    <ListItem
                      disablePadding
                      sx={{
                        position: 'relative',
                        '&:hover .consultation-menu-button': {
                          opacity: 1,
                        },
                      }}
                    >
                      <ListItemButton
                        onClick={() => {
                          navigate({
                            to: '/consultant',
                            search: {
                              conversationId: consultation.conversationId,
                            },
                          });
                        }}
                        sx={{
                          borderRadius: '6px',
                          padding: 1.5,
                          marginBottom: 1,
                          '&:hover': {
                            backgroundColor: '#f6f8fa',
                          },
                        }}
                      >
                        <ListItemText
                          primary={
                            <Typography
                              sx={{
                                fontSize: '13px',
                                color: '#24292f',
                                fontWeight: 500,
                                marginBottom: 0.5,
                              }}
                            >
                              {consultation.query}
                            </Typography>
                          }
                          secondary={
                            <Typography
                              component="span"
                              sx={{
                                fontSize: '11px',
                                color: '#57606a',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 0.5,
                              }}
                            >
                              <span>{formatDate(consultation.date)}</span>
                              <span>•</span>
                              <span>{consultation.model}</span>
                            </Typography>
                          }
                        />
                        <IconButton
                          className="consultation-menu-button"
                          size="small"
                          onClick={(e) => handleMenuOpen(e, consultation.id)}
                          sx={{
                            opacity: 0,
                            transition: 'opacity 0.2s',
                            color: '#57606a',
                            '&:hover': {
                              backgroundColor: '#e5e7eb',
                            },
                          }}
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </ListItemButton>
                      <Menu
                        anchorEl={menuAnchor[consultation.id]}
                        open={Boolean(menuAnchor[consultation.id])}
                        onClose={() => handleMenuClose(consultation.id)}
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'right',
                        }}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                        }}
                      >
                        <MenuItem
                          onClick={() =>
                            handleMenuAction('rename', consultation.id)
                          }
                        >
                          <ListItemIcon>
                            <RenameIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText>Rename</ListItemText>
                        </MenuItem>
                        <MenuItem
                          onClick={() =>
                            handleMenuAction('share', consultation.id)
                          }
                        >
                          <ListItemIcon>
                            <ShareIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText>Share</ListItemText>
                        </MenuItem>
                        <MenuItem
                          onClick={() =>
                            handleMenuAction('export', consultation.id)
                          }
                        >
                          <ListItemIcon>
                            <ExportIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText>Export</ListItemText>
                        </MenuItem>
                        <Divider />
                        <MenuItem
                          onClick={() =>
                            handleMenuAction('delete', consultation.id)
                          }
                          sx={{
                            color: '#dc2626',
                            '&:hover': {
                              backgroundColor: '#fef2f2',
                            },
                          }}
                        >
                          <ListItemIcon>
                            <DeleteIcon
                              fontSize="small"
                              sx={{ color: '#dc2626' }}
                            />
                          </ListItemIcon>
                          <ListItemText>Delete</ListItemText>
                        </MenuItem>
                      </Menu>
                    </ListItem>
                    {index < consultations.length - 1 && (
                      <Divider sx={{ marginY: 0.5 }} />
                    )}
                  </Box>
                ))}
              </List>
            )}
          </Box>
        )}

        {/* Collapse Button */}
        <Box
          sx={{
            padding: 2,
            borderTop: '1px solid #d0d7de',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <IconButton
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            sx={{
              color: '#57606a',
              '&:hover': {
                backgroundColor: '#f6f8fa',
                color: '#24292f',
              },
            }}
          >
            {sidebarCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: 3,
          gap: 2,
          overflow: 'auto',
          alignItems: showNewConsultation ? 'center' : 'stretch',
          justifyContent: showNewConsultation ? 'center' : 'flex-start',
        }}
      >
        {showNewConsultation ? (
          <>
            <Box
              sx={{
                position: 'relative',
                borderRadius: '12px',
                backgroundColor: '#ffffff',
                border: '2px solid #d0d7de',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.2s ease-in-out',
                width: '100%',
                maxWidth: '800px',
                '&:hover': {
                  borderColor: '#2563eb',
                },
                '&:focus-within': {
                  borderColor: '#2563eb',
                  boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.1)',
                },
              }}
            >
              <InputBase
                placeholder="Ask Anything"
                fullWidth
                value={newQueryValue}
                onChange={(e) => setNewQueryValue(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && newQueryValue.trim()) {
                    navigate({
                      to: '/consultant',
                      search: { query: newQueryValue.trim() },
                    });
                    setShowNewConsultation(false);
                    setNewQueryValue('');
                  }
                }}
                autoFocus
                sx={{
                  color: '#24292f',
                  padding: '16px 20px',
                  fontSize: '16px',
                  '& .MuiInputBase-input': {
                    '&::placeholder': {
                      color: '#57606a',
                      opacity: 1,
                    },
                  },
                }}
              />
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  borderTop: '1px solid #f0f0f0',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton
                    onClick={handleAttachMenuOpen}
                    size="small"
                    sx={{
                      color: '#57606a',
                      '&:hover': {
                        backgroundColor: '#f6f8fa',
                        color: '#2563eb',
                      },
                    }}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                  <Typography
                    onClick={handleAttachMenuOpen}
                    sx={{
                      fontSize: '14px',
                      color: '#57606a',
                      cursor: 'pointer',
                      '&:hover': {
                        color: '#2563eb',
                      },
                    }}
                  >
                    Add pets, docs or images
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Button
                    onClick={handleModelMenuOpen}
                    endIcon={<ArrowDropDownIcon />}
                    sx={{
                      color: '#24292f',
                      textTransform: 'none',
                      fontSize: '14px',
                      fontWeight: 500,
                      '&:hover': {
                        backgroundColor: '#f6f8fa',
                      },
                    }}
                  >
                    {selectedModel === 'gpt-4.5' && 'GPT 4.5'}
                    {selectedModel === 'gpt-5-plus' && 'GPT 5 (Plus)'}
                    {selectedModel === 'grok-3' && 'Grok 3'}
                    {selectedModel === 'grok-4-plus' && 'Grok 4 (Plus)'}
                    {selectedModel === 'veterai-3.1' && 'VeteriAI 3.1'}
                  </Button>
                  <Menu
                    anchorEl={modelMenuAnchor}
                    open={Boolean(modelMenuAnchor)}
                    onClose={handleModelMenuClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'left',
                    }}
                    sx={{
                      '& .MuiPaper-root': {
                        marginTop: 1,
                        minWidth: 200,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        padding: '8px 16px',
                        borderBottom: '1px solid #d0d7de',
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: '12px',
                          fontWeight: 600,
                          color: '#57606a',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        Modelos
                      </Typography>
                    </Box>
                    <MenuItem
                      onClick={() => handleModelSelect('gpt-4.5')}
                      selected={selectedModel === 'gpt-4.5'}
                      sx={{
                        '&.Mui-selected': {
                          backgroundColor: '#f6f8fa',
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          width: '100%',
                          gap: 1,
                        }}
                      >
                        <Typography sx={{ fontSize: '14px' }}>
                          GPT 4.5
                        </Typography>
                        {selectedModel === 'gpt-4.5' && (
                          <CheckIcon
                            sx={{ fontSize: '18px', color: '#2563eb' }}
                          />
                        )}
                      </Box>
                    </MenuItem>
                    <MenuItem
                      onClick={() => handleModelSelect('gpt-5-plus')}
                      selected={selectedModel === 'gpt-5-plus'}
                      disabled
                      sx={{
                        '&.Mui-selected': {
                          backgroundColor: '#f6f8fa',
                        },
                        '&.Mui-disabled': {
                          opacity: 0.6,
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          width: '100%',
                          gap: 1,
                        }}
                      >
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <Typography sx={{ fontSize: '14px' }}>
                            GPT 5 (Plus)
                          </Typography>
                          <LockIcon
                            sx={{ fontSize: '16px', color: '#dc2626' }}
                          />
                        </Box>
                        {selectedModel === 'gpt-5-plus' && (
                          <CheckIcon
                            sx={{ fontSize: '18px', color: '#2563eb' }}
                          />
                        )}
                      </Box>
                    </MenuItem>
                    <MenuItem
                      onClick={() => handleModelSelect('grok-3')}
                      selected={selectedModel === 'grok-3'}
                      sx={{
                        '&.Mui-selected': {
                          backgroundColor: '#f6f8fa',
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          width: '100%',
                          gap: 1,
                        }}
                      >
                        <Typography sx={{ fontSize: '14px' }}>
                          Grok 3
                        </Typography>
                        {selectedModel === 'grok-3' && (
                          <CheckIcon
                            sx={{ fontSize: '18px', color: '#2563eb' }}
                          />
                        )}
                      </Box>
                    </MenuItem>
                    <MenuItem
                      onClick={() => handleModelSelect('grok-4-plus')}
                      selected={selectedModel === 'grok-4-plus'}
                      disabled
                      sx={{
                        '&.Mui-selected': {
                          backgroundColor: '#f6f8fa',
                        },
                        '&.Mui-disabled': {
                          opacity: 0.6,
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          width: '100%',
                          gap: 1,
                        }}
                      >
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <Typography sx={{ fontSize: '14px' }}>
                            Grok 4 (Plus)
                          </Typography>
                          <LockIcon
                            sx={{ fontSize: '16px', color: '#dc2626' }}
                          />
                        </Box>
                        {selectedModel === 'grok-4-plus' && (
                          <CheckIcon
                            sx={{ fontSize: '18px', color: '#2563eb' }}
                          />
                        )}
                      </Box>
                    </MenuItem>
                    <MenuItem
                      onClick={() => handleModelSelect('veterai-3.1')}
                      selected={selectedModel === 'veterai-3.1'}
                      sx={{
                        '&.Mui-selected': {
                          backgroundColor: '#f6f8fa',
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          width: '100%',
                          gap: 1,
                        }}
                      >
                        <Typography sx={{ fontSize: '14px' }}>
                          VeteriAI 3.1
                        </Typography>
                        {selectedModel === 'veterai-3.1' && (
                          <CheckIcon
                            sx={{ fontSize: '18px', color: '#2563eb' }}
                          />
                        )}
                      </Box>
                    </MenuItem>
                    <Divider />
                    <Box
                      sx={{
                        padding: '12px 16px',
                        backgroundColor: '#f6f8fa',
                        borderTop: '1px solid #d0d7de',
                        textAlign: 'center',
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: '12px',
                          color: '#57606a',
                          fontWeight: 500,
                        }}
                      >
                        <Button
                          onClick={() => {
                            handleModelMenuClose();
                            // TODO: Handle upgrade
                          }}
                          sx={{
                            textTransform: 'none',
                            fontSize: '12px',
                            color: '#2563eb',
                            fontWeight: 500,
                            padding: 0,
                            minWidth: 'auto',
                            verticalAlign: 'baseline',
                            '&:hover': {
                              backgroundColor: 'transparent',
                              textDecoration: 'underline',
                            },
                          }}
                        >
                          Upgrade
                        </Button>{' '}
                        to access more models and limits
                      </Typography>
                    </Box>
                  </Menu>
                  <IconButton
                    onClick={() => {
                      if (newQueryValue.trim()) {
                        navigate({
                          to: '/consultant',
                          search: { query: newQueryValue.trim() },
                        });
                        setShowNewConsultation(false);
                        setNewQueryValue('');
                      }
                    }}
                    disabled={!newQueryValue.trim()}
                    sx={{
                      color: '#10b981',
                      '&:hover': {
                        color: '#059669',
                        backgroundColor: '#f0fdf4',
                      },
                      '&.Mui-disabled': {
                        color: '#d0d7de',
                      },
                    }}
                  >
                    <SendIcon />
                  </IconButton>
                </Box>
              </Box>
            </Box>
            <Menu
              anchorEl={attachMenuAnchor}
              open={Boolean(attachMenuAnchor)}
              onClose={handleAttachMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              sx={{
                '& .MuiPaper-root': {
                  marginTop: 1,
                  minWidth: 220,
                },
              }}
            >
              <Box
                sx={{
                  padding: '8px 16px',
                  borderBottom: '1px solid #d0d7de',
                }}
              >
                <Typography
                  sx={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#57606a',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  Add Content
                </Typography>
              </Box>
              <MenuItem
                onClick={() => {
                  handleAttachMenuClose();
                  // TODO: Handle add pets
                }}
                sx={{
                  '&:hover': {
                    backgroundColor: '#f6f8fa',
                  },
                }}
              >
                <ListItemIcon>
                  <PetsIcon fontSize="small" sx={{ color: '#57606a' }} />
                </ListItemIcon>
                <ListItemText>
                  <Typography sx={{ fontSize: '14px' }}>Pets</Typography>
                </ListItemText>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleAttachMenuClose();
                  // TODO: Handle add files or docs
                }}
                sx={{
                  '&:hover': {
                    backgroundColor: '#f6f8fa',
                  },
                }}
              >
                <ListItemIcon>
                  <AttachFileIcon fontSize="small" sx={{ color: '#57606a' }} />
                </ListItemIcon>
                <ListItemText>
                  <Typography sx={{ fontSize: '14px' }}>
                    Files or Docs
                  </Typography>
                </ListItemText>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleAttachMenuClose();
                  // TODO: Handle add images
                }}
                sx={{
                  '&:hover': {
                    backgroundColor: '#f6f8fa',
                  },
                }}
              >
                <ListItemIcon>
                  <ImageIcon fontSize="small" sx={{ color: '#57606a' }} />
                </ListItemIcon>
                <ListItemText>
                  <Typography sx={{ fontSize: '14px' }}>Images</Typography>
                </ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem
                onClick={() => {
                  handleAttachMenuClose();
                  // TODO: Handle upload from computer
                }}
                sx={{
                  '&:hover': {
                    backgroundColor: '#f6f8fa',
                  },
                }}
              >
                <ListItemIcon>
                  <UploadFileIcon fontSize="small" sx={{ color: '#57606a' }} />
                </ListItemIcon>
                <ListItemText>
                  <Typography sx={{ fontSize: '14px' }}>
                    Upload from computer
                  </Typography>
                </ListItemText>
              </MenuItem>
            </Menu>
          </>
        ) : (
          (selectedConsultation ||
            query ||
            conversationMessages.length > 0) && (
            <Paper
              sx={{
                padding: 3,
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #d0d7de',
              }}
            >
              {/* Conversation Messages */}
              {conversationMessages.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {conversationMessages.map((message, index) => (
                    <Box key={message.id}>
                      {/* Question */}
                      {message.query && (
                        <Box sx={{ marginBottom: 2 }}>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                              marginBottom: 1.5,
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: '12px',
                                fontWeight: 600,
                                color: '#57606a',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                              }}
                            >
                              Question
                            </Typography>
                          </Box>
                          <Typography
                            sx={{
                              fontSize: '16px',
                              color: '#24292f',
                              lineHeight: 1.6,
                            }}
                          >
                            {message.query}
                          </Typography>
                        </Box>
                      )}
                      {/* Response */}
                      {message.response ? (
                        <Box>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                              marginBottom: 1.5,
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: '12px',
                                fontWeight: 600,
                                color: '#57606a',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                              }}
                            >
                              Response
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: '11px',
                                color: '#57606a',
                                marginLeft: 'auto',
                              }}
                            >
                              {selectedConsultation?.model ||
                              selectedModel === 'veterai-3.1'
                                ? 'VeteriAI 3.1'
                                : selectedModel === 'gpt-4.5'
                                  ? 'GPT 4.5'
                                  : selectedModel === 'grok-3'
                                    ? 'Grok 3'
                                    : selectedModel}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              padding: 2.5,
                              backgroundColor: '#f6f8fa',
                              borderRadius: '8px',
                              border: '1px solid #d0d7de',
                              position: 'relative',
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: '15px',
                                color: '#24292f',
                                lineHeight: 1.7,
                              }}
                            >
                              {message.response}
                            </Typography>
                            <Box
                              sx={{
                                position: 'absolute',
                                bottom: 8,
                                right: 12,
                                opacity: 0.15,
                                display: 'flex',
                                alignItems: 'center',
                              }}
                            >
                              <img
                                src={logo}
                                alt="Veteri"
                                style={{
                                  height: '16px',
                                  width: 'auto',
                                }}
                              />
                            </Box>
                          </Box>
                        </Box>
                      ) : (
                        index === conversationMessages.length - 1 &&
                        isLoadingResponse && (
                          <Box
                            sx={{
                              padding: 2.5,
                              backgroundColor: '#f6f8fa',
                              borderRadius: '8px',
                              border: '1px solid #d0d7de',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 2,
                            }}
                          >
                            <CircularProgress
                              size={20}
                              sx={{ color: '#2563eb' }}
                            />
                            <Typography
                              sx={{
                                fontSize: '15px',
                                color: '#57606a',
                                fontStyle: 'italic',
                              }}
                            >
                              Generating response...
                            </Typography>
                          </Box>
                        )
                      )}
                    </Box>
                  ))}
                </Box>
              ) : selectedConsultation ? (
                <>
                  <Box>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        marginBottom: 1.5,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: '12px',
                          fontWeight: 600,
                          color: '#57606a',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        Question
                      </Typography>
                    </Box>
                    <Typography
                      sx={{
                        fontSize: '16px',
                        color: '#24292f',
                        lineHeight: 1.6,
                      }}
                    >
                      {selectedConsultation.query}
                    </Typography>
                  </Box>
                  <Box sx={{ marginTop: 3 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        marginBottom: 1.5,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: '12px',
                          fontWeight: 600,
                          color: '#57606a',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        Response
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: '11px',
                          color: '#57606a',
                          marginLeft: 'auto',
                        }}
                      >
                        {selectedConsultation.model}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        padding: 2.5,
                        backgroundColor: '#f6f8fa',
                        borderRadius: '8px',
                        border: '1px solid #d0d7de',
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: '15px',
                          color: '#24292f',
                          lineHeight: 1.7,
                        }}
                      >
                        {selectedConsultation.response}
                      </Typography>
                    </Box>
                  </Box>
                </>
              ) : query ? (
                <Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      marginBottom: 1.5,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#57606a',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      Question
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      fontSize: '16px',
                      color: '#24292f',
                      lineHeight: 1.6,
                    }}
                  >
                    {query}
                  </Typography>
                </Box>
              ) : null}
              {/* Continue Conversation Input */}
              {(selectedConsultation || conversationMessages.length > 0) && (
                <Box
                  sx={{
                    marginTop: 3,
                    position: 'relative',
                    borderRadius: '12px',
                    backgroundColor: '#ffffff',
                    border: '2px solid #d0d7de',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      borderColor: '#2563eb',
                    },
                    '&:focus-within': {
                      borderColor: '#2563eb',
                      boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.1)',
                    },
                  }}
                >
                  <InputBase
                    placeholder="Continue the conversation..."
                    fullWidth
                    value={continueQueryValue}
                    onChange={(e) => setContinueQueryValue(e.target.value)}
                    onKeyPress={(e) => {
                      if (
                        e.key === 'Enter' &&
                        continueQueryValue.trim() &&
                        !isLoadingResponse
                      ) {
                        handleContinueConversation();
                      }
                    }}
                    sx={{
                      color: '#24292f',
                      padding: '16px 20px',
                      fontSize: '16px',
                      '& .MuiInputBase-input': {
                        '&::placeholder': {
                          color: '#57606a',
                          opacity: 1,
                        },
                      },
                    }}
                  />
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      borderTop: '1px solid #f0f0f0',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconButton
                        onClick={handleAttachMenuOpen}
                        size="small"
                        sx={{
                          color: '#57606a',
                          '&:hover': {
                            backgroundColor: '#f6f8fa',
                            color: '#2563eb',
                          },
                        }}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                      <Typography
                        onClick={handleAttachMenuOpen}
                        sx={{
                          fontSize: '14px',
                          color: '#57606a',
                          cursor: 'pointer',
                          '&:hover': {
                            color: '#2563eb',
                          },
                        }}
                      >
                        Add pets, docs or images
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Button
                        onClick={handleModelMenuOpen}
                        endIcon={<ArrowDropDownIcon />}
                        sx={{
                          color: '#24292f',
                          textTransform: 'none',
                          fontSize: '14px',
                          fontWeight: 500,
                          '&:hover': {
                            backgroundColor: '#f6f8fa',
                          },
                        }}
                      >
                        {selectedModel === 'gpt-4.5' && 'GPT 4.5'}
                        {selectedModel === 'gpt-5-plus' && 'GPT 5 (Plus)'}
                        {selectedModel === 'grok-3' && 'Grok 3'}
                        {selectedModel === 'grok-4-plus' && 'Grok 4 (Plus)'}
                        {selectedModel === 'veterai-3.1' && 'VeteriAI 3.1'}
                      </Button>
                      <IconButton
                        onClick={handleContinueConversation}
                        disabled={
                          !continueQueryValue.trim() || isLoadingResponse
                        }
                        sx={{
                          color: '#10b981',
                          '&:hover': {
                            color: '#059669',
                            backgroundColor: '#f0fdf4',
                          },
                          '&.Mui-disabled': {
                            color: '#d0d7de',
                          },
                        }}
                      >
                        <SendIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
              )}
            </Paper>
          )
        )}
      </Box>
    </Box>
  );
}
